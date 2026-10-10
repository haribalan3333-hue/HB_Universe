import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, BookOpen, Lightbulb, Brain, Smile, Mic } from 'lucide-react';
import { ReturnToUniverse } from '../../navigation/ReturnToUniverse';
import { WorldBreadcrumb } from '../../navigation/WorldBreadcrumb';
import { useUniverseStore } from '../../store/universeStore';
import { pageVariants } from '../../animations/transitions';
import { AICharacter, AICommand } from '../../ai/aiTypes';
import { AI_CHARACTERS } from '../../ai/AICharacters';
import { AIChatRoom } from '../../components/AI/AIChatRoom';
import { AICharacterSelector } from '../../components/AI/AICharacterSelector';
import { AIVoiceModal } from '../../components/AI/AIVoiceModal';
import { StoryLab } from '../../components/AI/StoryLab';
import { IdeaLab } from '../../components/AI/IdeaLab';
import { QuizLab } from '../../components/AI/QuizLab';
import { EntertainmentHub } from '../../components/AI/EntertainmentHub';

export const AIWorld: React.FC = () => {
  const { initiatePortalTravel } = useUniverseStore();
  const [activeTab, setActiveTab] = useState<'chat' | 'characters' | 'story' | 'idea' | 'quiz' | 'entertainment'>('chat');
  const [activeCharacter, setActiveCharacter] = useState<AICharacter>(AI_CHARACTERS[0]);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  const tabs = [
    { id: 'chat', label: 'AI CHAT', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'characters', label: 'PERSONAS', icon: <Users className="w-4 h-4" /> },
    { id: 'story', label: 'STORY LAB', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'idea', label: 'IDEA LAB', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'quiz', label: 'QUIZ TRIAL', icon: <Brain className="w-4 h-4" /> },
    { id: 'entertainment', label: 'JOKES & RIDDLES', icon: <Smile className="w-4 h-4" /> },
  ];

  const handleExecuteCommand = (cmd: AICommand) => {
    if (cmd.type === 'NAVIGATE' && cmd.destination) {
      initiatePortalTravel(cmd.destination);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-8 max-w-7xl mx-auto select-none pb-12"
    >
      {/* Navigation Headers */}
      <ReturnToUniverse worldName="AI WORLD" themeColor="#FFE500" />
      <WorldBreadcrumb worldName="AI WORLD" themeColor="#FFE500" />

      {/* Hero Marquee */}
      <div className="relative rounded-3xl bg-slate-950 border border-yellow-400/40 p-6 sm:p-10 overflow-hidden shadow-[0_0_80px_rgba(255,229,0,0.2)] backdrop-blur-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-yellow-400/15 border-2 border-yellow-400 flex items-center justify-center text-yellow-400 shadow-[0_0_30px_rgba(255,229,0,0.5)]">
              <span className="text-3xl">{activeCharacter.avatar}</span>
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest">
                DIMENSION SECTOR 04 • QUANTUM COGNITIVE CORE
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white font-orbitron tracking-wider">
                AI WORLD
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-inter mt-1 max-w-xl">
                Interact with the HB AI Guide, synthesize stories and project ideas, solve quantum riddles, or execute cross-world commands.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowVoiceModal(true)}
            className="px-5 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-orbitron text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(255,229,0,0.6)] cursor-pointer"
          >
            <Mic className="w-4 h-4" />
            <span>VOICE MATRIX</span>
          </button>
        </div>
      </div>

      {/* Tool / Mode Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-orbitron text-xs font-bold tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-yellow-400 text-black shadow-[0_0_20px_rgba(255,229,0,0.5)] border border-yellow-300'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab View */}
      <div>
        {activeTab === 'chat' && (
          <AIChatRoom
            character={activeCharacter}
            onOpenVoice={() => setShowVoiceModal(true)}
            onExecuteCommand={handleExecuteCommand}
          />
        )}
        {activeTab === 'characters' && (
          <AICharacterSelector
            selectedCharacter={activeCharacter}
            onSelectCharacter={(char) => {
              setActiveCharacter(char);
              setActiveTab('chat');
            }}
          />
        )}
        {activeTab === 'story' && <StoryLab />}
        {activeTab === 'idea' && <IdeaLab />}
        {activeTab === 'quiz' && <QuizLab />}
        {activeTab === 'entertainment' && <EntertainmentHub />}
      </div>

      {/* Voice Modal */}
      {showVoiceModal && (
        <AIVoiceModal
          character={activeCharacter}
          onClose={() => setShowVoiceModal(false)}
          onExecuteCommand={handleExecuteCommand}
        />
      )}
    </motion.div>
  );
};
