'use client';

import { useState } from 'react';
import { Play, Pause, Copy, CheckCheck, Loader2 } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

export default function AyahView({ ayahs, translations, surah }) {
  const { playAyah, togglePlay, isPlaying, isLoading, currentAyah } = useAudio();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="space-y-4">
      {ayahs.map((ayah, i) => {
        const translation = translations?.ayahs?.[i];
        const isCurrentAyah =
          currentAyah?.surahNumber === surah.number &&
          currentAyah?.ayahNumberInSurah === ayah.numberInSurah;

        const handlePlayAyah = () => {
          if (isCurrentAyah) {
            togglePlay();
            return;
          }

          playAyah({
            surah,
            ayahNumberInSurah: ayah.numberInSurah,
            globalAyahNumber: ayah.number,
          });
        };

        return (
          <div key={ayah.number} className="ayah-card group">
            {/* Header row */}
            <div className="flex items-center justify-between mb-5">
              <div className="ayah-number-badge">{ayah.numberInSurah}</div>

              <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={handlePlayAyah}
                  className="px-3 h-8 btn-glass inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white"
                  title="Play ayah"
                >
                  {isCurrentAyah && isLoading ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : isCurrentAyah && isPlaying ? (
                    <Pause size={12} />
                  ) : (
                    <Play size={12} className="ml-0.5" />
                  )}
                  Play
                </button>

                <button
                  onClick={() => handleCopy(ayah.text + (translation ? '\n\n' + translation.text : ''), ayah.number)}
                  className="w-8 h-8 btn-glass flex items-center justify-center"
                  title="Copy ayah"
                >
                  {copiedId === ayah.number ? (
                    <CheckCheck size={13} className="text-emerald-400" />
                  ) : (
                    <Copy size={13} className="text-white/50" />
                  )}
                </button>
              </div>
            </div>

            {/* Arabic text */}
            <p
              className="arabic-text text-white/92 mb-5 leading-loose"
              style={{ fontSize: 'clamp(20px, 3.5vw, 28px)', fontFamily: "'Scheherazade New', 'Amiri', serif" }}
            >
              {ayah.text}
            </p>

            {/* Divider */}
            {translation && (
              <div className="border-t border-white/06 pt-4">
                <p className="text-sm sm:text-base text-white/50 leading-relaxed" style={{ fontFamily: 'var(--font-sf), system-ui, sans-serif' }}>
                  {translation.text}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
