import { getAllSurahs } from '@/lib/api';
import SurahGrid from '@/components/SurahGrid';

export const revalidate = 86400;

export default async function HomePage() {
  const surahs = await getAllSurahs();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero */}
      <div className="text-center mb-12 animate-fade-up">
        <div className="inline-flex items-center gap-2 btn-glass px-4 py-2 text-xs text-white/50 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          114 Surahs · 6,236 Ayahs
        </div>

        <h1 className="bismillah mb-3">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </h1>

        <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed mt-4">
          In the name of Allah, the Most Gracious, the Most Merciful.
          Read, listen, and reflect on the Noble Quran.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        {[
          { label: 'Surahs', value: '114', sub: 'Chapters' },
          { label: 'Ayahs', value: '6,236', sub: 'Verses' },
          { label: 'Juz', value: '30', sub: 'Parts' },
        ].map(stat => (
          <div key={stat.label} className="glass-card p-4 text-center">
            <div className="text-lg sm:text-2xl font-bold text-white/90">{stat.value}</div>
            <div className="text-xs text-white/40 mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Surah Grid with Search */}
      <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white/80">All Surahs</h2>
        </div>
        <SurahGrid surahs={surahs} />
      </div>
    </div>
  );
}
