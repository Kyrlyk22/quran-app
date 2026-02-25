'use client';

import { useState } from 'react';
import { Play, Pause, BookOpen, Copy, CheckCheck } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

export default function AyahView({ ayahs, translations, surah }) {
  const { playSurah, togglePlay, isPlaying, currentSurah } = useAudio();
  const [copiedId, setCopiedId] = useState(null);
  const isCurrentSurah = currentSurah?.number === surah.number;

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
        return (
          <div key={ayah.number} className="ayah-card group">
            {/* Header row */}
            <div className="flex items-center justify-between mb-5">
              <div className="ayah-number-badge">{ayah.numberInSurah}</div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
