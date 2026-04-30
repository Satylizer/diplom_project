import React from 'react';
import { observer } from 'mobx-react-lite';

const SearchFilters = observer(({ searchStore }) => {
  const { filters, activeFilter, setActiveFilter } = searchStore;

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {filters.map((filter) => (
        <button 
          key={filter} 
          onClick={() => setActiveFilter(filter)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
            activeFilter === filter 
              ? 'bg-white text-black border-white' 
              : 'bg-[rgba(255,255,255,0.1)] text-[#9F9FA9] border-[#27272A] hover:bg-[rgba(255,255,255,0.15)] hover:text-white'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
});

export default SearchFilters;