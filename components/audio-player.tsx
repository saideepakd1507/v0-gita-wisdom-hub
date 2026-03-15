'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useLanguage, LANGUAGES, type LanguageCode } from '@/lib/language-context';

interface AudioPlayerProps {
  chapterVerse: string;
  language?: string;
  compact?: boolean;
  text?: string; // Text to speak using TTS
  sanskritText?: string; // Original Sanskrit text
}

// Get TTS language code for Web Speech API
const getTTSLanguage = (language: string): string => {
  const lang = LANGUAGES.find(l => l.code === language);
  return lang?.ttsLang || 'en-IN';
};

// Check if speech synthesis is available
const isSpeechSynthesisAvailable = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

export function AudioPlayer({ 
  chapterVerse, 
  language: propLanguage, 
  compact = false,
  text,
  sanskritText 
}: AudioPlayerProps) {
  const { currentLanguage } = useLanguage();
  const language = propLanguage || currentLanguage;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useTTS, setUseTTS] = useState(true);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [chapter, verse] = chapterVerse.split('.').map(Number);

  // Get the text to speak based on language
  const getTextToSpeak = useCallback((): string => {
    if (text) return text;
    if (sanskritText) return sanskritText;
    // Default Sanskrit sloka for demonstration
    return `श्लोक ${chapter} अध्याय ${verse}`;
  }, [text, sanskritText, chapter, verse]);

  // Stop any ongoing speech
  const stopSpeech = useCallback(() => {
    if (isSpeechSynthesisAvailable()) {
      window.speechSynthesis.cancel();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  // Clean up on unmount or language change
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  // Reset when language changes
  useEffect(() => {
    stopSpeech();
    setError(null);
  }, [language, stopSpeech]);

  const speakText = useCallback(async () => {
    if (!isSpeechSynthesisAvailable()) {
      setError('Speech not supported');
      return;
    }

    // Cancel any existing speech
    window.speechSynthesis.cancel();

    const textToSpeak = getTextToSpeak();
    if (!textToSpeak) {
      setError('No text available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utteranceRef.current = utterance;

      // Get the TTS language - use Hindi for Sanskrit as browsers don't support Sanskrit TTS
      const ttsLang = getTTSLanguage(language);
      utterance.lang = ttsLang;
      utterance.rate = language === 'sanskrit' ? 0.75 : 0.85; // Slower for Sanskrit
      utterance.pitch = 1;
      utterance.volume = isMuted ? 0 : volume;

      // Wait for voices to load first
      let voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        await new Promise<void>((resolve) => {
          const checkVoices = () => {
            voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
              resolve();
            } else {
              setTimeout(checkVoices, 100);
            }
          };
          checkVoices();
        });
      }

      // Try to find the best matching voice for the language
      const langPrefix = ttsLang.split('-')[0];
      // Prefer Indian voices for Indian languages
      let langVoice = voices.find(v => v.lang === ttsLang);
      if (!langVoice) {
        langVoice = voices.find(v => v.lang.startsWith(langPrefix + '-IN'));
      }
      if (!langVoice) {
        langVoice = voices.find(v => v.lang.startsWith(langPrefix));
      }
      if (langVoice) {
        utterance.voice = langVoice;
      }

      // Estimate duration based on text length (rough estimate)
      const estimatedDuration = Math.max(textToSpeak.length * 0.08, 3);
      setDuration(estimatedDuration);

      utterance.onstart = () => {
        setIsLoading(false);
        setIsPlaying(true);
        setCurrentTime(0);
        
        // Update progress
        intervalRef.current = setInterval(() => {
          setCurrentTime(prev => {
            if (prev >= estimatedDuration) {
              return prev;
            }
            return prev + 0.1;
          });
        }, 100);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };

      utterance.onerror = (event) => {
        if (event.error !== 'canceled') {
          setError('Speech failed');
        }
        setIsLoading(false);
        setIsPlaying(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      setError('Speech failed');
      setIsLoading(false);
    }
  }, [getTextToSpeak, language, volume, isMuted]);

  const togglePlay = async () => {
    if (isPlaying) {
      stopSpeech();
    } else {
      await speakText();
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (utteranceRef.current) {
      utteranceRef.current.volume = newVolume;
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (utteranceRef.current) {
      utteranceRef.current.volume = !isMuted ? 0 : volume;
    }
  };

  const restart = () => {
    stopSpeech();
    speakText();
  };

  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get language display name
  const getLanguageDisplay = () => {
    const lang = LANGUAGES.find(l => l.code === language);
    return lang?.name || language.charAt(0).toUpperCase() + language.slice(1);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePlay}
          disabled={isLoading}
          className="h-8 w-8 p-0 rounded-full bg-primary/20 hover:bg-primary/30"
          title={`Play in ${getLanguageDisplay()}`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4 text-primary" />
          ) : (
            <Play className="w-4 h-4 text-primary ml-0.5" />
          )}
        </Button>
        {error && <span className="text-xs text-muted-foreground">{error}</span>}
      </div>
    );
  }

  return (
    <div className="audio-player rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {getLanguageDisplay()} Audio
        </span>
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          disabled={isLoading}
          className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent hover:opacity-90 text-primary-foreground"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </Button>

        <div className="flex-1 space-y-1">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            className="cursor-pointer"
            disabled
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={restart}
          className="h-8 w-8"
          title="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="h-8 w-8"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-20 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

// Specialized component for playing slokas with full text
export function SlokaAudioPlayer({ 
  sloka,
  language: propLanguage,
}: {
  sloka: {
    id: string;
    sanskrit: string;
    translations: Record<string, string>;
  };
  language?: LanguageCode;
}) {
  const { currentLanguage } = useLanguage();
  const language = propLanguage || currentLanguage;
  
  // Get the text based on selected language
  const getText = () => {
    if (language === 'sanskrit') {
      return sloka.sanskrit;
    }
    return sloka.translations[language as keyof typeof sloka.translations] || sloka.translations.english;
  };

  return (
    <AudioPlayer 
      chapterVerse={sloka.id}
      language={language}
      text={getText()}
      sanskritText={sloka.sanskrit}
    />
  );
}
