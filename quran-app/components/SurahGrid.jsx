'use client';

import { useState, useMemo } from 'react';
import { Search, X, Filter } from 'lucide-react';
import SurahCard from './SurahCard';

const JUZ_GROUPS = ['All', 'Meccan', 'Medinan'];

export default function SurahGrid({ surahs }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    return surahs.filter(s => {
      const matchesQuery =
        !query ||
        s.englishName.toLowerCase().includes(query.toLowerCase()) ||
        s.englishNameTranslation.toLowerCase().includes(query.toLowerCase()) ||
        s.name.includes(query) ||
        String(s.number).includes(query);
      const matchesFilter = filter === 'All' || s.revelationType === filter;
      return matchesQuery && matchesFilter;
    });
  }, [surahs, query, filter]);

  return (
    <div>
      {/* Search & Filter Bar */}
      <div className="flex gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name or number..."
            className="search-input w-full h-12 pl-11 pr-10 text-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1 glass rounded-full px-1.5 py-1.5 border border-white/10">
          {JUZ_GROUPS.map(g => (
            <button
              key={g}
              onClick={() => setFilter(g)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                filter === g
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/25'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {(query || filter !== 'All') && (
        <div className="mb-4 text-sm text-white/35">
          {filtered.length} surah{filtered.length !== 1 ? 's' : ''} found
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 stagger-children">
          {filtered.map((surah, i) => (
            <SurahCard key={surah.number} surah={surah} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-4xl mb-4 opacity-30">🔍</div>
          <div className="text-white/50 font-medium">No surahs found</div>
          <div className="text-sm text-white/30 mt-1">Try a different search term</div>
        </div>
      )}
    </div>
  );
}
