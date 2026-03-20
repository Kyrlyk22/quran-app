import Link from 'next/link';
import { notFound } from 'next/navigation';
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

export default async function SurahPage({ params, searchParams }) {
  const id = Number(params.id);
  if (Number.isNaN(id) || id < 1 || id > 114) notFound();

  const translation = searchParams?.translation || 'ru.kuliev';

  let payload;
  try {
    payload = await getSurahWithTranslation(id, translation);
  } catch {
    notFound();
  }

  const [surahs] = await Promise.all([getAllSurahs()]);
  const { surah, translation: translationData } = payload;
  const featuredSidebar = [1, 2, 3, 4, 112]
    .map((number) => surahs.find((item) => item.number === number))
    .filter(Boolean);

  const localizedName = RU_SURAH_NAMES[surah.number] || surah.englishName;
  const localizedSubtitle = surah.englishNameTranslation;

  return (
    <div className="reader-layout">
      <aside className="reader-sidebar">
        <h2 className="sidebar-title">Список Сур</h2>
        <div className="surah-list">
          {featuredSidebar.slice(0, 4).map((item) => (
            <Link
              key={item.number}
              href={`/surah/${item.number}`}
              className={`surah-list-item ${item.number === surah.number ? 'active' : ''}`}
            >
              <span className="surah-list-index">{item.number}</span>
              <div>
                <div className="surah-list-name">{RU_SURAH_NAMES[item.number] || item.englishName}</div>
                <div className="surah-list-translation">{item.englishNameTranslation}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="sidebar-section-label">{SURAH_TYPES.Meccan}</div>
        <div className="surah-list">
          {featuredSidebar.slice(4).map((item) => (
            <Link
              key={item.number}
              href={`/surah/${item.number}`}
              className={`surah-list-item ${item.number === surah.number ? 'active' : ''}`}
            >
              <span className="surah-list-index">{item.number}</span>
              <div>
                <div className="surah-list-name">{RU_SURAH_NAMES[item.number] || item.englishName}</div>
                <div className="surah-list-translation">{item.englishNameTranslation}</div>
              </div>
            </Link>
          ))}
        </div>
      </aside>

      <section className="reader-main">
        <div className="reader-content">
          <div className="mobile-surah-strip">
            {featuredSidebar.map((item) => (
              <Link
                key={item.number}
                href={`/surah/${item.number}`}
                className={`mobile-chip ${item.number === surah.number ? 'active' : ''}`}
              >
                {item.number}. {RU_SURAH_NAMES[item.number] || item.englishName}
              </Link>
            ))}
          </div>
        </div>

        <section className="hero-banner">
          <div className="hero-content">
            <h1 className="hero-title">{localizedName}</h1>
            <p className="hero-subtitle">{localizedSubtitle}</p>
            <div className="hero-bismillah">
              <span className="line" />
              <span className="arabic-display" style={{ fontSize: '2.25rem' }}>
                {surah.number === 9 ? surah.name : 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ'}
              </span>
              <span className="line" />
            </div>
          </div>
        </section>

        <div className="reader-content">
          <AyahView ayahs={surah.ayahs} translations={translationData} surah={surah} />

          <div className="reading-divider">Продолжение чтения</div>
        </div>
      </section>
    </div>
  );
}
