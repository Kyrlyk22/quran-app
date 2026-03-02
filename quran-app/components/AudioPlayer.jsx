'use client';

import { useState, useCallback } from 'react';
import { useAudio } from '@/context/AudioContext';
import { RECITERS } from '@/lib/api';
import {
  Play, Pause, Music2, Loader2, X
} from 'lucide-react';

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function AudioPlayer() {
  const {
    currentSurah, isPlaying, isLoading, currentReciter,
    progress, duration, isVisible,
    togglePlay, seek, changeReciter, stopAndReset
  } = useAudio();

  const [showReciters, setShowReciters] = useState(false);
  const handleSeek = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = (x / rect.width) * 100;
    seek(Math.max(0, Math.min(100, pct)));
  }, [seek]);

  if (!isVisible || !currentSurah) return null;

  return (
    <>
      {/* Reciter overlay */}
      {showReciters && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowReciters(false)}
        >
          <div
            className="w-full max-w-md glass rounded-[32px] p-2 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-white/90">Select Reciter</span>
              <button
                onClick={() => setShowReciters(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center"
              >
                <X size={14} className="text-white/70" />
              </button>
            </div>
            <div className="divide-y divide-white/06">
              {RECITERS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => { changeReciter(r); setShowReciters(false); }}
                  className={`w-full px-4 py-3 flex items-center justify-between transition-colors rounded-2xl ${
                    currentReciter.id === r.id ? 'bg-indigo-500/15' : 'hover:bg-white/05'
                  }`}
                >
                  <div className="text-left">
                    <div className="text-sm font-medium text-white/90">{r.name}</div>
                    <div className="text-xs text-white/40 mt-0.5 arabic-text-amiri">{r.nameAr}</div>
                  </div>
                  {currentReciter.id === r.id && (
                    <div className="w-2 h-2 rounded-full bg-indigo-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Player */}
      <div className="glass-player fixed bottom-0 left-0 right-0 z-40 animate-slide-up">
        {/* Progress bar - tap to seek */}
        <div
          className="progress-track mx-0 cursor-pointer hover:h-[6px] transition-all duration-200"
          onClick={handleSeek}
          style={{ height: '3px', borderRadius: 0 }}
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="max-w-5xl mx-auto px-4 py-3">
          {/* Main player row */}
          <div className="flex items-center gap-4">
            {/* Surah info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-indigo-500/40 to-purple-600/30 border border-indigo-400/20 flex items-center justify-center flex-shrink-0">
                  <Music2 size={14} className="text-indigo-300" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white/90 truncate">
                    {currentSurah.englishName}
                  </div>
                  <button
                    onClick={() => setShowReciters(true)}
                    className="text-xs text-white/40 hover:text-white/60 transition-colors truncate text-left"
                  >
                    {currentReciter.name}
                  </button>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Time */}
              <span className="text-xs text-white/30 tabular-nums hidden sm:block">
                {formatTime(duration * progress / 100)} / {formatTime(duration)}
              </span>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-11 h-11 btn-accent flex items-center justify-center rounded-full animate-pulse-glow"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 size={18} className="text-white animate-spin" />
                ) : isPlaying ? (
                  <Pause size={18} className="text-white" />
                ) : (
                  <Play size={18} className="text-white ml-0.5" />
                )}
              </button>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowReciters(true)}
                className="btn-glass px-3 py-1.5 text-xs text-white/60 hover:text-white/80 hidden sm:flex items-center gap-1.5"
              >
                <Music2 size={12} />
                Reciter
              </button>
              <button
                onClick={() => {
                  setShowReciters(false);
                  stopAndReset();
                }}
                className="w-8 h-8 btn-glass flex items-center justify-center"
              >
                <X size={14} className="text-white/50" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
