'use client';

import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { getAudioUrl, RECITERS } from '@/lib/api';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [currentSurah, setCurrentSurah] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentReciter, setCurrentReciter] = useState(RECITERS[0]);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    audio.addEventListener('timeupdate', () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    });
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('canplay', () => setIsLoading(false));
    audio.addEventListener('waiting', () => setIsLoading(true));
    audio.addEventListener('ended', () => setIsPlaying(false));
    audio.addEventListener('error', () => { setIsLoading(false); setIsPlaying(false); });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const playSurah = useCallback((surah) => {
    const audio = audioRef.current;
    if (!audio) return;

    setCurrentSurah(surah);
    setIsVisible(true);
    setIsLoading(true);
    setProgress(0);

    const url = getAudioUrl(currentReciter.id, surah.number);
    audio.src = url;
    audio.volume = volume;
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsLoading(false));
  }, [currentReciter, volume]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentSurah) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true));
    }
  }, [isPlaying, currentSurah]);

  const seek = useCallback((percent) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = (percent / 100) * audio.duration;
  }, []);

  const changeReciter = useCallback((reciter) => {
    setCurrentReciter(reciter);
    if (currentSurah) {
      const audio = audioRef.current;
      const wasPlaying = isPlaying;
      const currentTime = audio.currentTime;
      const url = getAudioUrl(reciter.id, currentSurah.number);
      audio.src = url;
      audio.currentTime = 0;
      if (wasPlaying) audio.play().then(() => setIsPlaying(true));
    }
  }, [currentSurah, isPlaying]);

  const skipSurah = useCallback((direction) => {
    if (!currentSurah) return;
    const nextNumber = currentSurah.number + direction;
    if (nextNumber < 1 || nextNumber > 114) return;
    // Will be called from outside with surah data
  }, [currentSurah]);

  const updateVolume = useCallback((val) => {
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  }, []);

  return (
    <AudioContext.Provider value={{
      currentSurah,
      isPlaying,
      isLoading,
      currentReciter,
      progress,
      duration,
      volume,
      isVisible,
      playSurah,
      togglePlay,
      seek,
      changeReciter,
      skipSurah,
      updateVolume,
      setCurrentSurah,
      setIsVisible,
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
}
