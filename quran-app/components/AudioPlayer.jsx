'use client';

import { useCallback, useState } from 'react';
import { useAudio } from '@/context/AudioContext';
import { RECITERS } from '@/lib/api';
import { Mic, Pause, Play, Repeat, Settings, Shuffle, SkipBack, SkipForward, Volume2 } from 'lucide-react';

function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function AudioPlayer() {
  const {
    currentSurah,
    isPlaying,
    isLoading,
    currentReciter,
    progress,
    duration,
    isVisible,
    togglePlay,
    seek,
    changeReciter,
  } = useAudio();

  const [reciterIndex, setReciterIndex] = useState(0);

  const handleSeek = useCallback((event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const pct = ((event.clientX - rect.left) / rect.width) * 100;
    seek(Math.max(0, Math.min(100, pct)));
  }, [seek]);

  const switchReciter = () => {
    const nextIndex = (reciterIndex + 1) % RECITERS.length;
    setReciterIndex(nextIndex);
    changeReciter(RECITERS[nextIndex]);
  };

  if (!isVisible || !currentSurah) return null;

  const elapsed = duration * progress / 100;

  return (
    <div className="audio-player">
      <div className="audio-player-inner">
        <div className="audio-summary">
          <div className="audio-summary-icon">
            <Mic size={18} strokeWidth={2} />
          </div>
          <div>
            <div className="audio-summary-title">{currentReciter?.name || 'Mishary Rashid Alafasy'}</div>
            <div className="audio-summary-subtitle">Surah {currentSurah.englishName}</div>
          </div>
        </div>

        <div className="audio-center">
          <div className="audio-controls">
            <button className="audio-control-button" type="button" aria-label="Shuffle">
              <Shuffle size={16} strokeWidth={2} />
            </button>
            <button className="audio-control-button" type="button" aria-label="Previous">
              <SkipBack size={16} strokeWidth={2} />
            </button>
            <button className="audio-play-button" type="button" aria-label={isPlaying ? 'Pause' : 'Play'} onClick={togglePlay}>
              {isLoading ? (
                <span className="animate-spin inline-flex">
                  <Settings size={17} strokeWidth={2} />
                </span>
              ) : isPlaying ? (
                <Pause size={17} strokeWidth={2} />
              ) : (
                <Play size={17} strokeWidth={2} style={{ marginLeft: 2 }} />
              )}
            </button>
            <button className="audio-control-button" type="button" aria-label="Next">
              <SkipForward size={16} strokeWidth={2} />
            </button>
            <button className="audio-control-button" type="button" aria-label="Repeat">
              <Repeat size={16} strokeWidth={2} />
            </button>
          </div>

          <div className="audio-progress-row">
            <span>{formatTime(elapsed)}</span>
            <button
              type="button"
              className="audio-progress-track"
              onClick={handleSeek}
              aria-label="Seek audio"
            >
              <span className="audio-progress-fill" style={{ width: `${progress}%` }} />
            </button>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="audio-right">
          <Volume2 size={18} strokeWidth={2} />
          <div className="audio-volume-track" aria-hidden="true">
            <div className="audio-volume-fill" style={{ width: '68%' }} />
          </div>
          <button className="audio-control-button" type="button" aria-label="Settings" onClick={switchReciter}>
            <Settings size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
