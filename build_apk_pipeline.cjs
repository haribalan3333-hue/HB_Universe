const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const targetDir = 'C:\\Users\\Administrator\\.gradle\\wrapper\\dists\\gradle-8.14.3-bin\\cv11ve7ro1n3o1j4so8xd9n66';
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const targetZip = path.join(targetDir, 'gradle-8.14.3-bin.zip');
const targetOk = path.join(targetDir, 'gradle-8.14.3-bin.zip.ok');
const targetLck = path.join(targetDir, 'gradle-8.14.3-bin.zip.lck');
const extractedDir = path.join(targetDir, 'gradle-8.14.3');

const url = 'https://mirrors.cloud.tencent.com/gradle/gradle-8.14.3-bin.zip';
const targetSize = 137393837; // 131.03 MB
const NUM_CHUNKS = 8;

function downloadRange(start, end, chunkFile) {
  return new Promise((resolve, reject) => {
    let downloaded = 0;
    if (fs.existsSync(chunkFile)) {
      downloaded = fs.statSync(chunkFile).size;
    }
    const expected = end - start + 1;
    if (downloaded >= expected) {
      return resolve();
    }

    const curStart = start + downloaded;
    const stream = fs.createWriteStream(chunkFile, { flags: downloaded > 0 ? 'a' : 'w' });
    const req = https.get(url, {
      headers: { 'Range': `bytes=${curStart}-${end}` },
      timeout: 30000
    }, (res) => {
      if (res.statusCode !== 200 && res.statusCode !== 206) {
        stream.close();
        return reject(new Error(`Status ${res.statusCode}`));
      }
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        resolve();
      });
    });

    req.on('error', (err) => {
      stream.close();
      reject(err);
    });
    req.on('timeout', () => {
      req.destroy();
      stream.close();
      reject(new Error('Timeout'));
    });
  });
}

async function downloadChunkWithRetry(start, end, chunkFile, id) {
  while (true) {
    try {
      await downloadRange(start, end, chunkFile);
      break;
    } catch (e) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

async function parallelDownload() {
  const chunkSize = Math.ceil(targetSize / NUM_CHUNKS);
  const chunkFiles = [];
  const tasks = [];

  console.log(`Starting ${NUM_CHUNKS} parallel connections to download Gradle (${(targetSize / (1024*1024)).toFixed(2)} MB)...`);

  for (let i = 0; i < NUM_CHUNKS; i++) {
    const start = i * chunkSize;
    const end = Math.min((i + 1) * chunkSize - 1, targetSize - 1);
    const chunkFile = path.join(targetDir, `gradle.part.${i}`);
    chunkFiles.push(chunkFile);
    tasks.push(downloadChunkWithRetry(start, end, chunkFile, i));
  }

  // Progress reporter
  const interval = setInterval(() => {
    let total = 0;
    for (const f of chunkFiles) {
      if (fs.existsSync(f)) {
        total += fs.statSync(f).size;
      }
    }
    process.stdout.write(`\rProgress: ${(total / (1024*1024)).toFixed(2)} MB / ${(targetSize / (1024*1024)).toFixed(2)} MB (${((total/targetSize)*100).toFixed(1)}%)`);
  }, 500);

  await Promise.all(tasks);
  clearInterval(interval);
  console.log('\nAll parts downloaded! Merging files...');

  const finalStream = fs.createWriteStream(targetZip);
  for (const f of chunkFiles) {
    const buf = fs.readFileSync(f);
    finalStream.write(buf);
    fs.unlinkSync(f);
  }
  finalStream.end();
  await new Promise(r => finalStream.on('finish', r));
  console.log('Merged complete zip file:', fs.statSync(targetZip).size, 'bytes');
}

async function run() {
  console.log('=== Step 1: Ensuring Gradle is ready ===');
  if (!fs.existsSync(extractedDir) || !fs.existsSync(targetOk)) {
    let currentSize = fs.existsSync(targetZip) ? fs.statSync(targetZip).size : 0;
    if (currentSize !== targetSize) {
      await parallelDownload();
    }
    
    console.log('\n=== Step 2: Extracting Gradle distribution ===');
    try {
      execSync(`powershell -Command "Expand-Archive -Path '${targetZip}' -DestinationPath '${targetDir}' -Force"`, { stdio: 'inherit' });
      fs.writeFileSync(targetOk, '');
      fs.writeFileSync(targetLck, '');
      console.log('Gradle successfully extracted and initialized!');
    } catch (e) {
      console.error('Extraction error:', e.message);
    }
  } else {
    console.log('Gradle 8.14.3 is already extracted and ready.');
  }

  console.log('\n=== Step 3: Compiling HB Universe APK ===');
  const env = {
    ...process.env,
    JAVA_HOME: 'C:\\Program Files\\Android\\Android Studio\\jbr',
    ANDROID_HOME: 'C:\\Users\\Administrator\\AppData\\Local\\Android\\Sdk',
    PATH: 'C:\\Program Files\\Android\\Android Studio\\jbr\\bin;' + process.env.PATH,
  };

  const androidDir = path.resolve(__dirname, 'android');
  const gradlewCmd = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
  
  const result = spawnSync(gradlewCmd, ['assembleDebug', '--no-daemon'], {
    cwd: androidDir,
    env,
    stdio: 'inherit',
    shell: true
  });

  if (result.status === 0) {
    const apkPath = path.join(androidDir, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
    const destApk = path.resolve(__dirname, 'HB-Universe.apk');
    if (fs.existsSync(apkPath)) {
      fs.copyFileSync(apkPath, destApk);
      console.log('\n========================================================');
      console.log('🎉 SUCCESS! HB-UNIVERSE APK GENERATED:');
      console.log(`📍 File Location: ${destApk}`);
      console.log('========================================================');
    }
  } else {
    console.error('\n❌ Gradle build failed with exit code:', result.status);
  }
}

run();
