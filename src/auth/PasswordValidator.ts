export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long.' };
  }
  return { valid: true, message: 'Password meets security requirements.' };
}

export function validateUsername(username: string): { valid: boolean; message: string } {
  const clean = username.trim();
  if (clean.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters long.' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(clean)) {
    return { valid: false, message: 'Username can only contain letters, numbers, and underscores.' };
  }
  return { valid: true, message: 'Username valid.' };
}
