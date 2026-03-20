import Link from 'next/link';
import { getAllSurahs, getSurahWithTranslation, SURAH_TYPES } from '@/lib/api';
import AyahView from '@/components/AyahView';

const RU_SURAH_NAMES = {
  1: 'Аль-Фатиха',
  2: 'Аль-Бакара',
  3: 'Аль-Имран',
  4: 'Ан-Ниса',
  112: 'Аль-Ихлас',
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [surahs, featured] = await Promise.all([
    getAllSurahs(),
    getSurahWithTranslation(1, 'ru.kuliev'),
  ]);

  const featuredSurah = featured.surah;
  const featuredTranslation = {
    ...featured.translation,
    ayahs: featured.translation.ayahs.slice(0, 4),
  };

  const sidebarSurahs = [1, 2, 3, 4, 112]
    .map((number) => surahs.find((surah) => surah.number === number))
    .filter(Boolean);

  return (
    <div className="reader-layout">
      <aside className="reader-sidebar">
        <h2 className="sidebar-title">Список Сур</h2>
        <div className="surah-list">
          {sidebarSurahs.slice(0, 4).map((surah) => (
            <Link
              key={surah.number}
              href={`/surah/${surah.number}`}
              className={`surah-list-item ${surah.number === 1 ? 'active' : ''}`}
            >
              <span className="surah-list-index">{surah.number}</span>
              <div>
                <div className="surah-list-name">{RU_SURAH_NAMES[surah.number] || surah.englishName}</div>
                <div className="surah-list-translation">{surah.englishNameTranslation}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="sidebar-section-label">{SURAH_TYPES.Meccan}</div>
        <div className="surah-list">
          {sidebarSurahs.slice(4).map((surah) => (
            <Link key={surah.number} href={`/surah/${surah.number}`} className="surah-list-item">
              <span className="surah-list-index">{surah.number}</span>
              <div>
                <div className="surah-list-name">{RU_SURAH_NAMES[surah.number] || surah.englishName}</div>
                <div className="surah-list-translation">{surah.englishNameTranslation}</div>
              </div>
            </Link>
          ))}
        </div>
      </aside>

      <section className="reader-main">
        <div className="reader-content">
          <div className="mobile-surah-strip">
            {sidebarSurahs.map((surah) => (
              <Link
                key={surah.number}
                href={`/surah/${surah.number}`}
                className={`mobile-chip ${surah.number === 1 ? 'active' : ''}`}
              >
                {surah.number}. {surah.englishName}
              </Link>
            ))}
          </div>
        </div>

        <section className="hero-banner">
          <div className="hero-content">
            <h1 className="hero-title">Аль-Фатиха</h1>
            <p className="hero-subtitle">Открывающая Коран</p>
            <div className="hero-bismillah">
              <span className="line" />
              <span className="arabic-display" style={{ fontSize: '2.25rem' }}>
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </span>
              <span className="line" />
            </div>
          </div>
        </section>

        <div className="reader-content">
          <AyahView
            ayahs={featuredSurah.ayahs.slice(0, 4)}
            translations={featuredTranslation}
            surah={featuredSurah}
          />

          <div className="reading-divider">Продолжение чтения</div>
        </div>
      </section>
    </div>
  );
}
