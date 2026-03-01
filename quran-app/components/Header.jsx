'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Home, Languages, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const LANGUAGES = [
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  { code: 'es', label: 'Español' },
  { code: 'zh', label: '中文' },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  return (
    <header className="glass-header sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-[14px] btn-accent flex items-center justify-center">
            <BookOpen size={18} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-white/90 leading-none">القرآن الكريم</div>
            <div className="text-[11px] text-white/40 mt-0.5">The Noble Quran</div>
          </div>
        </Link>

        {/* Center nav */}
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isHome
                ? 'bg-white/12 text-white border border-white/15'
                : 'text-white/50 hover:text-white/80 hover:bg-white/06'
            }`}
          >
            <Home size={15} />
            <span className="hidden sm:inline">Surahs</span>
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="btn-glass flex items-center gap-2 px-3 py-2 text-xs text-white/60 hover:text-white/80"
              aria-haspopup="listbox"
              aria-expanded={isLanguageOpen}
            >
              <Languages size={13} />
              <span className="hidden sm:inline">{selectedLanguage.label}</span>
              <ChevronDown size={12} className={`transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLanguageOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsLanguageOpen(false)} />
                <div className="absolute right-0 top-full mt-2 z-50 w-40 glass rounded-[18px] p-1.5 shadow-2xl">
                  {LANGUAGES.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        setSelectedLanguage(language);
                        setIsLanguageOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors ${
                        selectedLanguage.code === language.code
                          ? 'bg-indigo-500/15 text-indigo-300'
                          : 'text-white/60 hover:bg-white/06 hover:text-white/80'
                      }`}
                      role="option"
                      aria-selected={selectedLanguage.code === language.code}
                    >
                      {language.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="text-xs text-white/30 font-medium hidden sm:block">
            114 Surahs
          </div>
        </div>
      </div>
    </header>
  );
}
