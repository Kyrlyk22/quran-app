const BASE_URL = 'https://api.alquran.cloud/v1';
const QURAN_COM_BASE_URL = 'https://api.quran.com/api/v4';
const EVERYAYAH_BASE_URL = 'https://everyayah.com/data';

export async function getAllSurahs() {
  const res = await fetch(`${BASE_URL}/surah`, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error('Failed to fetch surahs');
  const data = await res.json();
  return data.data;
}

export async function getSurah(id) {
  const res = await fetch(`${BASE_URL}/surah/${id}`, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error('Failed to fetch surah');
  const data = await res.json();
  return data.data;
}

export async function getSurahWithTranslation(id, edition = 'en.sahih') {
  const [arabicRes, translationRes] = await Promise.all([
    fetch(`${BASE_URL}/surah/${id}`, { next: { revalidate: 86400 } }),
    fetch(`${BASE_URL}/surah/${id}/${edition}`, { next: { revalidate: 86400 } }),
  ]);
  if (!arabicRes.ok || !translationRes.ok) throw new Error('Failed to fetch surah data');
  const [arabicData, translationData] = await Promise.all([
    arabicRes.json(),
    translationRes.json(),
  ]);
  return {
    surah: arabicData.data,
    translation: translationData.data,
  };
}

export async function getAyah(reference, edition = 'quran-uthmani') {
  const res = await fetch(`${BASE_URL}/ayah/${reference}/${edition}`);
  if (!res.ok) throw new Error('Failed to fetch ayah');
  const data = await res.json();
  return data.data;
}

export const RECITERS = [
  {
    id: 'ar.alafasy',
    name: 'Mishary Alafasy',
    nameAr: 'مشاري العفاسي',
    quranComRecitationIds: [7],
    everyayahFolders: ['Alafasy_128kbps'],
  },
  {
    id: 'ar.abdurrahmaansudais',
    name: 'Abdul Rahman Al-Sudais',
    nameAr: 'عبدالرحمن السديس',
    quranComRecitationIds: [3],
    everyayahFolders: ['Abdurrahmaan_As-Sudais_192kbps'],
  },
  {
    id: 'ar.abdullahbasfar',
    name: 'Abdullah Basfar',
    nameAr: 'عبدالله بصفر',
    quranComRecitationIds: [21, 22],
    everyayahFolders: ['Abdullah_Basfar_64kbps', 'Abdullah_Basfar_192kbps'],
  },
  {
    id: 'ar.husary',
    name: 'Mahmoud Khalil Al-Husary',
    nameAr: 'محمود خليل الحصري',
    quranComRecitationIds: [5],
    everyayahFolders: ['Husary_128kbps'],
  },
  {
    id: 'ar.minshawi',
    name: 'Mohamed Siddiq El-Minshawi',
    nameAr: 'محمد صديق المنشاوي',
    quranComRecitationIds: [6],
    everyayahFolders: ['Minshawy_Murattal_128kbps'],
  },
];

export const TRANSLATIONS = [
  { id: 'en.sahih', name: 'English – Sahih International' },
  { id: 'en.pickthall', name: 'English – Pickthall' },
  { id: 'ru.kuliev', name: 'Russian – Kuliev' },
  { id: 'ru.osmanov', name: 'Russian – Osmanov' },
  { id: 'fr.hamidullah', name: 'French – Hamidullah' },
];

function getReciterById(reciterId) {
  return RECITERS.find((reciter) => reciter.id === reciterId) || RECITERS[0];
}

function normalizeAudioUrl(audioUrl) {
  if (!audioUrl) return null;
  if (audioUrl.startsWith('http://') || audioUrl.startsWith('https://')) return audioUrl;
  if (audioUrl.startsWith('//')) return `https:${audioUrl}`;
  return `https://audio.qurancdn.com/${audioUrl.replace(/^\/+/, '')}`;
}

export function getAudioUrl(reciterId, surahNumber) {
  const paddedSurah = String(surahNumber).padStart(3, '0');
  return `https://cdn.islamic.network/quran/audio-surah/128/${reciterId}/${paddedSurah}.mp3`;
}

function getReciterQuranComIds(reciter) {
  return reciter.quranComRecitationIds?.length ? reciter.quranComRecitationIds : [];
}

function getReciterEveryayahFolders(reciter) {
  return reciter.everyayahFolders?.length ? reciter.everyayahFolders : [];
}

export async function getQuranComSurahAudioUrl(reciterId, surahNumber) {
  const reciter = getReciterById(reciterId);

  for (const recitationId of getReciterQuranComIds(reciter)) {
    const res = await fetch(
      `${QURAN_COM_BASE_URL}/chapter_recitations/${recitationId}/${surahNumber}`,
      { cache: 'no-store' }
    );

    if (!res.ok) continue;

    const data = await res.json();
    const url = normalizeAudioUrl(data?.audio_file?.audio_url);
    if (url) return url;
  }

  throw new Error('Quran.com surah audio request failed for all configured recitation ids');
}

export async function getQuranComAyahAudioUrl(reciterId, surahNumber, ayahNumberInSurah) {
  const reciter = getReciterById(reciterId);
  const ayahKey = `${surahNumber}:${ayahNumberInSurah}`;

  for (const recitationId of getReciterQuranComIds(reciter)) {
    const res = await fetch(
      `${QURAN_COM_BASE_URL}/recitations/${recitationId}/by_ayah/${ayahKey}`,
      { cache: 'no-store' }
    );

    if (!res.ok) continue;

    const data = await res.json();
    const url = normalizeAudioUrl(data?.audio_files?.[0]?.url || data?.audio_file?.audio_url);
    if (url) return url;
  }

  throw new Error('Quran.com ayah audio request failed for all configured recitation ids');
}

export function getEveryayahSurahAudioUrls(reciterId, surahNumber) {
  const reciter = getReciterById(reciterId);
  const paddedSurah = String(surahNumber).padStart(3, '0');

  return getReciterEveryayahFolders(reciter).map(
    (folder) => `${EVERYAYAH_BASE_URL}/${folder}/${paddedSurah}.mp3`
  );
}

export function getEveryayahAyahAudioUrls(reciterId, globalAyahNumber) {
  const reciter = getReciterById(reciterId);
  const paddedAyah = String(globalAyahNumber).padStart(6, '0');

  return getReciterEveryayahFolders(reciter).map(
    (folder) => `${EVERYAYAH_BASE_URL}/${folder}/${paddedAyah}.mp3`
  );
}

export async function getSurahAudioUrls(reciterId, surahNumber) {
  const fallbackUrls = [
    ...getEveryayahSurahAudioUrls(reciterId, surahNumber),
    getAudioUrl(reciterId, surahNumber),
  ];

  try {
    const quranComAudioUrl = await getQuranComSurahAudioUrl(reciterId, surahNumber);
    if (quranComAudioUrl) {
      return [quranComAudioUrl, ...fallbackUrls];
    }
  } catch (error) {
    console.warn('Quran.com surah audio unavailable, trying fallback sources.', error);
  }

  return fallbackUrls;
}

export async function getAyahAudioUrls(reciterId, surahNumber, ayahNumberInSurah, globalAyahNumber) {
  const fallbackUrls = [
    ...getEveryayahAyahAudioUrls(reciterId, globalAyahNumber),
    getAyahAudioUrl(reciterId, globalAyahNumber),
  ];

  try {
    const quranComAudioUrl = await getQuranComAyahAudioUrl(reciterId, surahNumber, ayahNumberInSurah);
    if (quranComAudioUrl) {
      return [quranComAudioUrl, ...fallbackUrls];
    }
  } catch (error) {
    console.warn('Quran.com ayah audio unavailable, trying fallback sources.', error);
  }

  return fallbackUrls;
}

export function getAyahAudioUrl(reciterId, globalAyahNumber) {
  const paddedAyah = String(globalAyahNumber).padStart(6, '0');
  return `https://cdn.islamic.network/quran/audio/128/${reciterId}/${paddedAyah}.mp3`;
}

export const SURAH_TYPES = {
  Meccan: 'مكية',
  Medinan: 'مدنية',
};