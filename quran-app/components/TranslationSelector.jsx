'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Languages, ChevronDown } from 'lucide-react';
import { TRANSLATIONS } from '@/lib/api';

export default function TranslationSelector({ currentTranslation }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (id) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('translation', id);
    router.replace(`?${params.toString()}`, { scroll: false });
    setOpen(false);
  };

  const current = TRANSLATIONS.find(t => t.id === currentTranslation) || TRANSLATIONS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="btn-glass flex items-center gap-2 px-3 py-2 text-xs text-white/60 hover:text-white/80"
      >
        <Languages size={13} />
        <span className="hidden sm:inline max-w-[100px] truncate">{current.name.split('–')[0].trim()}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-64 glass rounded-[20px] p-1.5 shadow-2xl">
            {TRANSLATIONS.map(t => (
              <button
                key={t.id}
                onClick={() => handleSelect(t.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors ${
                  t.id === currentTranslation
                    ? 'bg-indigo-500/15 text-indigo-300'
                    : 'text-white/60 hover:bg-white/06 hover:text-white/80'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
