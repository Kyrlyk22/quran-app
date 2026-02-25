const BASE_URL = 'https://api.alquran.cloud/v1';

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
  { id: 'ar.alafasy', name: 'Mishary Alafasy', nameAr: 'مشاري العفاسي' },
  { id: 'ar.abdurrahmaansudais', name: 'Abdul Rahman Al-Sudais', nameAr: 'عبدالرحمن السديس' },
  { id: 'ar.abdullahbasfar', name: 'Abdullah Basfar', nameAr: 'عبدالله بصفر' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary', nameAr: 'محمود خليل الحصري' },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq El-Minshawi', nameAr: 'محمد صديق المنشاوي' },
];

export const TRANSLATIONS = [
  { id: 'en.sahih', name: 'English – Sahih International' },
  { id: 'en.pickthall', name: 'English – Pickthall' },
  { id: 'ru.kuliev', name: 'Russian – Kuliev' },
  { id: 'ru.osmanov', name: 'Russian – Osmanov' },
  { id: 'fr.hamidullah', name: 'French – Hamidullah' },
];

export function getAudioUrl(reciterId, surahNumber) {
  const paddedSurah = String(surahNumber).padStart(3, '0');
  return `https://cdn.islamic.network/quran/audio-surah/128/${reciterId}/${paddedSurah}.mp3`;
}

export function getAyahAudioUrl(reciterId, globalAyahNumber) {
  const paddedAyah = String(globalAyahNumber).padStart(6, '0');
  return `https://cdn.islamic.network/quran/audio/128/${reciterId}/${paddedAyah}.mp3`;
}

export const SURAH_TYPES = {
  Meccan: 'مكية',
  Medinan: 'مدنية',
};
