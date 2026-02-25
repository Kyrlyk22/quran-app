import { getSurahWithTranslation, getAllSurahs } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import AyahView from '@/components/AyahView';
import SurahPlayButton from '@/components/SurahPlayButton';
import TranslationSelector from '@/components/TranslationSelector';
import { Suspense } from 'react';

export async function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({ id: String(i + 1) }));
}

export async function generateMetadata({ params }) {
  try {
    const { surah } = await getSurahWithTranslation(params.id);
    return {
      title: `${surah.englishName} – ${surah.englishNameTranslation} | Quran`,
      description: `Read Surah ${surah.englishName} (${surah.name}) with translation. ${surah.numberOfAyahs} ayahs.`,
    };
  } catch {
    return { title: 'Surah | Quran' };
  }
}

export const revalidate = 86400;

export default async function SurahPage({ params, searchParams }) {
  const id = parseInt(params.id);
  if (isNaN(id) || id < 1 || id > 114) notFound();

  const translation = searchParams?.translation || 'en.sahih';

  let data;
  try {
    data = await getSurahWithTranslation(id, translation);
  } catch {
    notFound();
  }

  const { surah, translation: translationData } = data;
  const showBismillah = surah.number !== 1 && surah.number !== 9;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      {/* Sticky Surah Header */}
      <div className="sticky top-16 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 glass-header mb-8">
        <div className="flex items-center justify-between gap-4">
          {/* Back + title */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="w-9 h-9 btn-glass flex items-center justify-center flex-shrink-0"
            >
              <ChevronLeft size={18} className="text-white/70" />
            </Link>
            <div className="min-w-0">
              <div className="font-semibold text-white/90 truncate text-sm sm:text-base">
                {surah.englishName}
              </div>
              <div className="text-xs text-white/40 truncate">
                {surah.revelationType} · {surah.numberOfAyahs} ayahs
              </div>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Suspense>
              <TranslationSelector currentTranslation={translation} />
            </Suspense>
            <SurahPlayButton surah={surah} />
          </div>
        </div>
      </div>

      {/* Surah Hero */}
      <div className="glass-card p-8 text-center mb-8 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(99,102,241,0.12) 0%, transparent 70%)' }}
        />
        <div className="relative">
          {/* Arabic name */}
          <div
            className="arabic-text-amiri text-white/90 mb-2"
            style={{ fontFamily: 'Amiri, serif', fontSize: 'clamp(32px, 8vw, 56px)' }}
          >
            {surah.name}
          </div>
          <div className="text-sm text-white/50 mb-1">{surah.englishName}</div>
          <div className="text-xs text-white/30">{surah.englishNameTranslation}</div>

          {/* Metadata pills */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/20 text-indigo-300">
              Surah {surah.number}
            </span>
            <span className={`text-xs px-3 py-1 rounded-full border ${
              surah.revelationType === 'Meccan'
                ? 'bg-amber-500/10 border-amber-400/20 text-amber-300'
                : 'bg-emerald-500/10 border-emerald-400/20 text-emerald-300'
            }`}>
              {surah.revelationType}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-white/06 border border-white/10 text-white/40">
              {surah.numberOfAyahs} Ayahs
            </span>
          </div>
        </div>
      </div>

      {/* Bismillah */}
      {showBismillah && (
        <div className="glass-card p-6 text-center mb-8">
          <div className="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          <div className="text-xs text-white/30 mt-3">In the name of Allah, the Most Gracious, the Most Merciful</div>
        </div>
      )}

      {/* Ayahs */}
      <AyahView
        ayahs={surah.ayahs}
        translations={translationData}
        surah={surah}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between mt-12 pt-6 border-t border-white/06">
        {surah.number > 1 ? (
          <Link
            href={`/surah/${surah.number - 1}`}
            className="glass-card px-5 py-3 flex items-center gap-2 hover:border-indigo-500/30 transition-all"
          >
            <ChevronLeft size={16} className="text-white/50" />
            <div>
              <div className="text-xs text-white/40">Previous</div>
              <div className="text-sm font-medium text-white/80">Surah {surah.number - 1}</div>
            </div>
          </Link>
        ) : <div />}

        {surah.number < 114 ? (
          <Link
            href={`/surah/${surah.number + 1}`}
            className="glass-card px-5 py-3 flex items-center gap-2 hover:border-indigo-500/30 transition-all"
          >
            <div className="text-right">
              <div className="text-xs text-white/40">Next</div>
              <div className="text-sm font-medium text-white/80">Surah {surah.number + 1}</div>
            </div>
            <ChevronRight size={16} className="text-white/50" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
