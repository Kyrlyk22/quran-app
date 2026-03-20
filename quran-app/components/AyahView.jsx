'use client';

import { useState } from 'react';
import { Bookmark, CheckCheck, Loader2, Play, Pause, Share2 } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';

export default function AyahView({ ayahs, translations, surah }) {
  const { playAyah, togglePlay, isPlaying, isLoading, currentAyah } = useAudio();
  const [copiedId, setCopiedId] = useState(null);

  const handleShare = async (ayah, translation) => {
    const text = `${ayah.text}\n\n${translation?.text || ''}`.trim();

    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopiedId(ayah.number);
        window.setTimeout(() => setCopiedId(null), 2000);
      }
    } catch {
      // intentionally ignored to keep the UI quiet for dismissed native share dialogs
    }
  };

  return (
    <div className="ayah-stack">
      {ayahs.map((ayah, index) => {
        const translation = translations?.ayahs?.[index];
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
          <article key={ayah.number} className="ayah-card">
            <div className="ayah-grid">
              <div>
                <div className="ayah-meta">
                  <span className="ayah-badge">
                    {surah.number}:{ayah.numberInSurah}
                  </span>
                  <button className="icon-button" type="button" aria-label="Bookmark ayah">
                    <Bookmark size={16} strokeWidth={1.8} />
                  </button>
                  <button
                    className="icon-button"
                    type="button"
                    aria-label="Share ayah"
                    onClick={() => handleShare(ayah, translation)}
                  >
                    {copiedId === ayah.number ? <CheckCheck size={16} strokeWidth={1.8} /> : <Share2 size={16} strokeWidth={1.8} />}
                  </button>
                  <button
                    className="icon-button"
                    type="button"
                    aria-label={isCurrentAyah && isPlaying ? 'Pause ayah' : 'Play ayah'}
                    onClick={handlePlayAyah}
                  >
                    {isCurrentAyah && isLoading ? (
                      <Loader2 size={16} className="animate-spin" strokeWidth={1.8} />
                    ) : isCurrentAyah && isPlaying ? (
                      <Pause size={16} strokeWidth={1.8} />
                    ) : (
                      <Play size={16} strokeWidth={1.8} />
                    )}
                  </button>
                </div>

                <p className="ayah-translation">{translation?.text || 'Перевод недоступен.'}</p>
                <div className="ayah-source">Перевод: Э. Кулиев</div>
              </div>

              <div className="ayah-arabic arabic-display">{ayah.text}</div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
