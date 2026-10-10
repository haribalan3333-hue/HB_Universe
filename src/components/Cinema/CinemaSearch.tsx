import React from 'react';
import { Search, X } from 'lucide-react';

interface CinemaSearchProps {
  query: string;
  onQueryChange: (val: string) => void;
}

export const CinemaSearch: React.FC<CinemaSearchProps> = ({ query, onQueryChange }) => {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
      <input
        type="text"
        placeholder="Search movies, AI films, trailers, lore..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-red-500 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all font-inter"
      />
      {query && (
        <button
          onClick={() => onQueryChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
