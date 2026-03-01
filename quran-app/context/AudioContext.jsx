'use client';

import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { getSurahAudioUrls, getAyahAudioUrls, RECITERS } from '@/lib/api';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [currentSurah, setCurrentSurah] = useState(null);
  const [currentAyah, setCurrentAyah] = useState(null);
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

  const playFirstAvailableUrl = useCallback(async (urls, shouldAutoplay = true) => {
    const audio = audioRef.current;
    if (!audio) return false;

    for (const url of urls) {
      try {
        audio.src = url;
        audio.load();

        if (shouldAutoplay) {
          await audio.play();
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }

        return true;
      } catch (error) {
        console.warn(`Audio source failed: ${url}`, error);
      }
    }

    return false;
  }, []);

  const playSurah = useCallback(async (surah) => {
    const audio = audioRef.current;
    if (!audio) return;

    setCurrentSurah(surah);
    setCurrentAyah(null);
    setIsVisible(true);
    setIsLoading(true);
    setProgress(0);

    try {
      const urls = await getSurahAudioUrls(currentReciter.id, surah.number);
      audio.volume = volume;
      const started = await playFirstAvailableUrl(urls, true);

      if (!started) {
        throw new Error('All audio providers failed');
      }
    } catch (error) {
      console.error('Failed to play surah audio:', error);
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [currentReciter, playFirstAvailableUrl, volume]);

  const playAyah = useCallback(async ({ surah, ayahNumberInSurah, globalAyahNumber }) => {
    const audio = audioRef.current;
    if (!audio) return;

    setCurrentSurah(surah);
    setCurrentAyah({
      surahNumber: surah.number,
      ayahNumberInSurah,
      globalAyahNumber,
    });
    setIsVisible(true);
    setIsLoading(true);
    setProgress(0);

    try {
      const urls = await getAyahAudioUrls(
        currentReciter.id,
        surah.number,
        ayahNumberInSurah,
        globalAyahNumber
      );
      audio.volume = volume;
      const started = await playFirstAvailableUrl(urls, true);

      if (!started) {
        throw new Error('All ayah audio providers failed');
      }
    } catch (error) {
      console.error('Failed to play ayah audio:', error);
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [currentReciter, playFirstAvailableUrl, volume]);

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

  const changeReciter = useCallback(async (reciter) => {
    setCurrentReciter(reciter);

    if (!currentSurah || !audioRef.current) return;

    const audio = audioRef.current;
    const wasPlaying = isPlaying;

    setIsLoading(true);

    try {
      const urls = currentAyah
        ? await getAyahAudioUrls(
            reciter.id,
            currentAyah.surahNumber,
            currentAyah.ayahNumberInSurah,
            currentAyah.globalAyahNumber
          )
        : await getSurahAudioUrls(reciter.id, currentSurah.number);

      audio.currentTime = 0;

      const started = await playFirstAvailableUrl(urls, wasPlaying);
      if (!started) {
        throw new Error('All audio providers failed');
      }
    } catch (error) {
      console.error('Failed to change reciter:', error);
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [currentAyah, currentSurah, isPlaying, playFirstAvailableUrl]);

  const stopAndReset = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
    }

    setIsPlaying(false);
    setIsLoading(false);
    setProgress(0);
    setDuration(0);
    setCurrentSurah(null);
    setCurrentAyah(null);
    setIsVisible(false);
  }, []);

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
      currentAyah,
      isPlaying,
      isLoading,
      currentReciter,
      progress,
      duration,
      volume,
      isVisible,
      playSurah,
      playAyah,
      togglePlay,
      seek,
      changeReciter,
      skipSurah,
      updateVolume,
      setCurrentSurah,
      setIsVisible,
      stopAndReset,
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
