'use client';

import { Play, Pause, Loader2 } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

export default function SurahPlayButton({ surah }) {
  const { playSurah, togglePlay, isPlaying, isLoading, currentSurah, currentAyah } = useAudio();
  const isCurrentSurah = currentSurah?.number === surah.number;
  const isCurrentSurahStream = isCurrentSurah && !currentAyah;

  const handleClick = () => {
    if (isCurrentSurahStream) {
      togglePlay();
      return;
    }

    playSurah(surah);
  };

  return (
    <button
      onClick={handleClick}
      className="btn-accent flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium text-white rounded-full"
    >
      {isCurrentSurahStream && isLoading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : isCurrentSurahStream && isPlaying ? (
        <Pause size={16} />
      ) : (
        <Play size={16} className="ml-0.5" />
      )}
      {isCurrentSurahStream && isPlaying ? 'Pause' : 'Play Surah'}
    </button>
  );
}
