import React, { useState } from 'react';
import { BookOpen, Sparkles, RefreshCw, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { StoryPrompt, GeneratedStory } from '../../ai/aiTypes';
import { demoAIProvider } from '../../ai/DemoAIProvider';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';

export const StoryLab: React.FC = () => {
  const { addXp, addCoins, showSpeech, soundEnabled } = useUniverseStore();
  const [genre, setGenre] = useState('Sci-Fi Odyssey');
  const [theme, setTheme] = useState('Dimensional Rift');
  const [characters, setCharacters] = useState('HB Pilot & AI Companion');
  const [tone, setTone] = useState('Cinematic & Heroic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [story, setStory] = useState<GeneratedStory | null>(null);
  const [currentChapter, setCurrentChapter] = useState(0);

  const handleGenerate = () => {
    if (soundEnabled) audioManager.playClick();
    setIsGenerating(true);

    setTimeout(() => {
      const prompt: StoryPrompt = { genre, theme, characters, length: 'medium', tone };
      const res = demoAIProvider.generateStory(prompt);
      setStory(res);
      setCurrentChapter(0);
      setIsGenerating(false);

      addXp(res.xpReward);
      addCoins(10);
      showSpeech(`📖 STORY GENERATED: +${res.xpReward} XP!`, 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-purple-400 uppercase font-bold tracking-widest">
              GENERATIVE LORE STUDIO
            </span>
            <h3 className="text-lg font-orbitron font-bold text-white">
              AI Story Laboratory
            </h3>
          </div>
        </div>
      </div>

      {!story ? (
        /* Configuration Inputs */
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 max-w-3xl mx-auto shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase">STORY GENRE</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="mt-1.5 w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-purple-400"
              >
                <option>Sci-Fi Odyssey</option>
                <option>Cyberpunk Noir</option>
                <option>Historical Epic</option>
                <option>Quantum Mystery</option>
                <option>Space Action</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 uppercase">CORE THEME</label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g. Lost Spire, Time Shift"
                className="mt-1.5 w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-purple-400 font-inter"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 uppercase">PROTAGONISTS</label>
              <input
                type="text"
                value={characters}
                onChange={(e) => setCharacters(e.target.value)}
                placeholder="e.g. Haribalan & Navigator"
                className="mt-1.5 w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-purple-400 font-inter"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 uppercase">NARRATIVE TONE</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="mt-1.5 w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-purple-400"
              >
                <option>Cinematic & Heroic</option>
                <option>Dark & Suspenseful</option>
                <option>Poetic & Meditative</option>
                <option>High Adrenaline</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-orbitron text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(168,85,247,0.5)] cursor-pointer"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isGenerating ? 'NEURAL ENGINE WEAVING LORE...' : 'GENERATE MULTIVERSE STORY'}</span>
          </button>
        </div>
      ) : (
        /* Generated Story Reader */
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-purple-500/40 max-w-3xl mx-auto space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono text-purple-400 font-bold">
              CHAPTER {currentChapter + 1} OF {story.chapters.length}
            </span>
            <button
              onClick={() => setStory(null)}
              className="text-xs font-mono text-slate-400 hover:text-white underline cursor-pointer"
            >
              GENERATE ANOTHER
            </button>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-orbitron text-white">
            {story.title}
          </h2>
          <p className="text-xs font-inter text-slate-400 italic">{story.summary}</p>

          {/* Chapter Content */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
            <h4 className="font-orbitron font-bold text-sm text-purple-400">
              {story.chapters[currentChapter].title}
            </h4>
            <p className="text-sm sm:text-base font-inter text-slate-200 leading-relaxed">
              {story.chapters[currentChapter].content}
            </p>
          </div>

          {/* Chapter Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentChapter((prev) => Math.max(0, prev - 1))}
              disabled={currentChapter === 0}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-orbitron font-bold text-slate-300 disabled:opacity-30 flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> PREV
            </button>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> +{story.xpReward} XP Claimed
            </span>
            <button
              onClick={() => setCurrentChapter((prev) => Math.min(story.chapters.length - 1, prev + 1))}
              disabled={currentChapter === story.chapters.length - 1}
              className="px-4 py-2 rounded-xl bg-purple-500 text-xs font-orbitron font-bold text-white disabled:opacity-30 flex items-center gap-1 cursor-pointer"
            >
              NEXT <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
