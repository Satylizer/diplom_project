import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import ProfileMenu from '../components/ProfileMenu';
import SearchQuery from '../components/Search/SearchQuery';

const Search = () => {
  return (
    <div className="flex bg-[#121212] min-h-screen antialiased selection:bg-[#2B7FFF]/30">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto relative scroll-smooth">
        <ProfileMenu />

        <div className="absolute top-0 left-0 right-0 h-200 pointer-events-none z-0">
          <div className="w-full h-full bg-linear-to-b from-[#1A1A1A] via-[#121212] to-[#121212]" />
        </div>
        
        <div className="relative z-10 pt-32 pb-12 px-8 lg:px-12 max-w-400">
          
          <div className="mb-10">
            <h1 className="text-white text-5xl md:text-6xl font-bold tracking-tight">
              Search
            </h1>
          </div>

          <SearchQuery />

        </div>
      </div>
    </div>
  );
};

export default Search;