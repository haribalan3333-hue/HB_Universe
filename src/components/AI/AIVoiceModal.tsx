import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { AICharacter, AICoreState } from '../../ai/aiTypes';
import { aiManager } from '../../ai/AIManager';
import { AICoreVisualizer } from './AICoreVisualizer';
import { useUniverseStore } from '../../store/universeStore';
import { audioManager } from '../../audio/audioManager';

interface AIVoiceModalProps {
  character: AICharacter;
  onClose: () => void;
  onExecuteCommand: (command: any) => void;
}

export const AIVoiceModal: React.FC<AIVoiceModalProps> = ({
  character,
  onClose,
  onExecuteCommand,
}) => {
  const { addXp, showSpeech, soundEnabled } = useUniverseStore();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiSpeechText, setAiSpeechText] = useState(character.greeting);
  const [voiceState, setVoiceState] = useState<AICoreState>('IDLE');
  const [supported, setSupported] = useState(true);

  // Check Web Speech API support
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
    }
  }, []);

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onstart = () => setVoiceState('RESPONDING');
    utterance.onend = () => setVoiceState('IDLE');
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    if (soundEnabled) audioManager.playClick();
    window.speechSynthesis?.cancel();

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceState('LISTENING');
        setTranscript('Listening for your voice command...');
      };

      recognition.onresult = async (event: any) => {
        const spoken = event.results[0][0].transcript;
        setTranscript(spoken);
        setIsListening(false);
        setVoiceState('THINKING');

        // Process response
        const response = await aiManager.sendMessage(spoken);
        setAiSpeechText(response.text);
        setVoiceState('RESPONDING');
        speakText(response.text);

        addXp(10);
        showSpeech('🎙️ VOICE INTERACTION COMPLETE: +10 XP!', 3000);

        if (response.command) {
          setTimeout(() => {
            onExecuteCommand(response.command);
          }, 2500);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceState('IDLE');
        setTranscript('Voice recognition timed out. Tap microphone to retry.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setSupported(false);
      setIsListening(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg rounded-3xl bg-slate-950 border border-yellow-400/40 p-6 sm:p-10 flex flex-col items-center text-center shadow-[0_0_80px_rgba(255,229,0,0.3)]"
        >
          {/* Close */}
          <button
            onClick={() => {
              window.speechSynthesis?.cancel();
              onClose();
            }}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900 border border-slate-700 hover:border-yellow-400 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-xs font-mono text-yellow-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Volume2 className="w-4 h-4" /> QUANTUM VOICE MATRIX
          </span>

          <h2 className="text-2xl font-black font-orbitron text-white mt-1">
            {character.name}
          </h2>

          {/* Central AI Core in Voice State */}
          <div className="my-8">
            <AICoreVisualizer state={voiceState} characterColor={character.color} size="lg" />
          </div>

          {/* AI Response Subtitle */}
          <div className="w-full bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-200 font-inter leading-relaxed max-h-32 overflow-y-auto">
            <p>{aiSpeechText}</p>
          </div>

          {/* User Transcript Display */}
          {transcript && (
            <p className="text-xs font-mono text-cyan-400 mt-3 italic">
              &quot;{transcript}&quot;
            </p>
          )}

          {/* Microphone Action Button */}
          {supported ? (
            <button
              onClick={startListening}
              className={`mt-6 px-8 py-4 rounded-2xl font-orbitron text-sm font-black uppercase tracking-wider flex items-center gap-3 cursor-pointer shadow-xl transition-all ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-[0_0_40px_rgba(255,42,85,0.8)]'
                  : 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-[0_0_30px_rgba(255,229,0,0.5)]'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <span>{isListening ? 'LISTENING... SPEAK NOW' : 'TAP TO SPEAK'}</span>
            </button>
          ) : (
            <div className="mt-6 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-amber-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Speech recognition is not supported in this browser. Use Text Chat!</span>
            </div>
          )}

          <div className="mt-6 flex items-center gap-2 text-[11px] font-mono text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Speak commands like: &quot;Take me to Arcade&quot; or &quot;Who is Haribalan&quot;</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
