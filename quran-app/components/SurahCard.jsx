'use client';

import Link from 'next/link';
import { Play, Pause } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

const REVELATION_COLORS = {
  Meccan: { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.25)', text: 'rgb(251, 191, 36)' },
  Medinan: { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.25)', text: 'rgb(52, 211, 153)' },
};

export default function SurahCard({ surah, index }) {
  const { playSurah, togglePlay, isPlaying, currentSurah } = useAudio();
  const isCurrentSurah = currentSurah?.number === surah.number;
  const revColor = REVELATION_COLORS[surah.revelationType] || REVELATION_COLORS.Meccan;

  const handlePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCurrentSurah) {
      togglePlay();
    } else {
      playSurah(surah);
    }
  };

  return (
    <Link href={`/surah/${surah.number}`} className="block group">
      <div className={`glass-card p-4 relative overflow-hidden ${isCurrentSurah ? 'border-indigo-500/30 bg-indigo-500/08' : ''}`}>
        {/* Subtle gradient bg */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 70%)' }}
        />

        <div className="relative flex items-center gap-3">
          {/* Number */}
          <div className="surah-number">
            {surah.number}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm font-semibold text-white/90 truncate">
                {surah.englishName}
              </span>
              {isCurrentSurah && isPlaying && (
                <span className="flex gap-0.5 items-end h-4">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="w-0.5 bg-indigo-400 rounded-full"
                      style={{
                        height: `${8 + i * 3}px`,
                        animation: `equalizer 0.8s ease-in-out infinite`,
                        animationDelay: `${i * 0.15}s`
                      }}
                    />
                  ))}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">{surah.englishNameTranslation}</span>
              <span className="text-white/20">·</span>
              <span className="text-xs text-white/30">{surah.numberOfAyahs} ayahs</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Revelation type */}
            <span
              className="hidden sm:block text-[11px] font-medium px-2.5 py-1 rounded-full border"
              style={{ background: revColor.bg, borderColor: revColor.border, color: revColor.text }}
            >
              {surah.revelationType}
            </span>

            {/* Arabic name */}
            <div className="text-right">
              <div className="arabic-text-amiri text-base text-white/80" style={{ fontFamily: 'Amiri, serif' }}>
                {surah.name}
              </div>
            </div>

            {/* Play button */}
            <button
              onClick={handlePlay}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
                isCurrentSurah
                  ? 'bg-indigo-500 shadow-lg shadow-indigo-500/30'
                  : 'bg-white/08 border border-white/10 opacity-0 group-hover:opacity-100'
              }`}
            >
              {isCurrentSurah && isPlaying ? (
                <Pause size={14} className="text-white" />
              ) : (
                <Play size={14} className="text-white ml-0.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
