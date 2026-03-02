'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Home, Languages, ChevronDown, Settings } from 'lucide-react';
import { useState } from 'react';
import { RECITERS, TRANSLATIONS } from '@/lib/api';

const LANGUAGES = [
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  { code: 'es', label: 'Español' },
  { code: 'zh', label: '中文' },
];

const THEMES = [
  { id: 'system', label: 'System' },
  { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0]);
  const [selectedTranslation, setSelectedTranslation] = useState(TRANSLATIONS[0]);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);

  return (
    <header className="glass-header sticky top-0 z-50">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 h-16 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group justify-self-start min-w-0">
          <div className="w-9 h-9 rounded-[14px] btn-accent flex items-center justify-center flex-shrink-0">
            <BookOpen size={18} className="text-white" />
          </div>
          <div className="hidden sm:block min-w-0">
            <div className="text-sm font-semibold text-white/90 leading-none truncate">القرآن الكريم</div>
            <div className="text-[11px] text-white/40 mt-0.5 truncate">The Noble Quran</div>
          </div>
        </Link>

        {/* Center nav */}
        <nav className="flex items-center gap-2 justify-self-center">
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

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 text-white/50 hover:text-white/80 hover:bg-white/06 border border-white/10"
          >
            <Settings size={15} />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 justify-self-end">
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

          <div className="text-xs text-white/30 font-medium hidden md:block">
            114 Surahs
          </div>
        </div>
      </div>

      {isSettingsOpen && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)} />
          <div className="fixed inset-x-0 top-20 z-[70] px-4 sm:px-6">
            <div className="w-full max-w-xl mx-auto glass rounded-[28px] border border-white/15 p-4 sm:p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm sm:text-base font-semibold text-white/90">Settings</h3>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 text-white/70"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs text-white/45 mb-2">Reciter</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {RECITERS.map((reciter) => (
                      <button
                        key={reciter.id}
                        onClick={() => setSelectedReciter(reciter)}
                        className={`text-left px-3 py-2 rounded-xl text-xs transition-colors ${
                          selectedReciter.id === reciter.id
                            ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-400/30'
                            : 'text-white/65 bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {reciter.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-white/45 mb-2">Translation</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TRANSLATIONS.map((translation) => (
                      <button
                        key={translation.id}
                        onClick={() => setSelectedTranslation(translation)}
                        className={`text-left px-3 py-2 rounded-xl text-xs transition-colors ${
                          selectedTranslation.id === translation.id
                            ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-400/30'
                            : 'text-white/65 bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {translation.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-white/45 mb-2">Theme</div>
                  <div className="flex items-center gap-2">
                    {THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme)}
                        className={`px-3 py-2 rounded-xl text-xs border transition-colors ${
                          selectedTheme.id === theme.id
                            ? 'bg-indigo-500/15 text-indigo-300 border-indigo-400/30'
                            : 'text-white/65 bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
