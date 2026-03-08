'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface AudioPlayerProps {
  chapterVerse: string;
  language: string;
  compact?: boolean;
}

// Audio URLs for different languages
const getAudioUrl = (chapter: number, verse: number, language: string): string => {
  // Using public domain audio sources
  const baseUrls: Record<string, string> = {
    english: `https://www.holy-bhagavad-gita.org/public/audio/verses/english/${chapter}-${verse}.mp3`,
    hindi: `https://www.holy-bhagavad-gita.org/public/audio/verses/hindi/${chapter}-${verse}.mp3`,
    sanskrit: `https://www.gitasupersite.iitk.ac.in/sites/default/files/audio/BG_${chapter.toString().padStart(2, '0')}_${verse.toString().padStart(2, '0')}.mp3`,
  };
  
  // For other languages, use Sanskrit chanting as fallback (which works for all)
  const langKey = language.toLowerCase();
  if (baseUrls[langKey]) {
    return baseUrls[langKey];
  }
  
  // Universal Sanskrit audio that works for all languages
  return `https://www.gitasupersite.iitk.ac.in/sites/default/files/audio/BG_${chapter.toString().padStart(2, '0')}_${verse.toString().padStart(2, '0')}.mp3`;
};

export function AudioPlayer({ chapterVerse, language, compact = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [chapter, verse] = chapterVerse.split('.').map(Number);

  const initAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.volume = volume;
    audio.muted = isMuted;
    
    const url = getAudioUrl(chapter, verse, language);
    audio.src = url;

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
      setIsLoading(false);
      setError(null);
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    audio.addEventListener('error', () => {
      setError('Audio unavailable');
      setIsLoading(false);
      setIsPlaying(false);
    });

    audio.addEventListener('waiting', () => {
      setIsLoading(true);
    });

    audio.addEventListener('canplay', () => {
      setIsLoading(false);
    });

    audioRef.current = audio;
  }, [chapter, verse, language, volume, isMuted]);

  useEffect(() => {
    initAudio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [initAudio]);

  const togglePlay = async () => {
    if (!audioRef.current) {
      initAudio();
    }

    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        await audio.play();
        setIsPlaying(true);
        setError(null);
      }
    } catch {
      setError('Unable to play audio');
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.muted = false;
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const restart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePlay}
          disabled={isLoading || !!error}
          className="h-8 w-8 p-0 rounded-full bg-primary/20 hover:bg-primary/30"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
          {language.charAt(0).toUpperCase() + language.slice(1)} Audio
        </span>
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlay}
          disabled={isLoading || !!error}
          className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent hover:opacity-90 text-primary-foreground"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
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
            onValueChange={handleSeek}
            className="cursor-pointer"
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
