'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, UserCircle2 } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', match: '/' },
  { href: '/surah/1', label: 'Quran', match: '/surah' },
  { href: '#', label: 'Dhikr' },
  { href: '#', label: 'Favorites' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="brand-mark">
          <strong>The Sacred Breath</strong>
        </Link>

        <nav className="top-nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = item.match
              ? pathname === item.match || pathname.startsWith(item.match + '/') || (item.match === '/surah' && pathname.startsWith('/surah'))
              : false;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`top-nav-link ${isActive || (item.label === 'Quran' && pathname.startsWith('/surah')) ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="header-actions">
          <button className="header-action-button" aria-label="Search">
            <Search size={18} strokeWidth={2} />
          </button>
          <button className="header-action-button" aria-label="Profile">
            <UserCircle2 size={19} strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  );
}
