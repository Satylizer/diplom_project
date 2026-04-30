import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { HiOutlineClock } from 'react-icons/hi2';
import { LibraryContext } from '../../main';

const LibrarySort = observer(() => {
  const libraryStore = useContext(LibraryContext);
  
  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        {libraryStore.filters.map((filter) => (
          <button 
            key={filter}
            onClick={() => libraryStore.setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm transition-all cursor-pointer ${libraryStore.activeFilter === filter ? 'bg-white text-black' : 'bg-[rgba(255,255,255,0.1)] text-[#9F9FA9] hover:bg-[rgba(255,255,255,0.15)] hover:text-white'}`}
          >
            {filter}
          </button>
        ))}
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <span className="text-[#71717B] text-sm">Sort by:</span>
        {libraryStore.sortOptions.map((option) => (
          <button 
            key={option.value}
            onClick={() => libraryStore.setSortBy(option.value)}
            className={`text-sm flex items-center gap-1.5 transition-colors cursor-pointer ${libraryStore.sortBy === option.value ? 'text-white' : 'text-[#9F9FA9] hover:text-white'}`}
          >
            {option.value === 'recent' && <HiOutlineClock className="size-4 stroke-[2px]" />}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
});

export default LibrarySort;