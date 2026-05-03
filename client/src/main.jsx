import { createContext, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import AlbumStore from './store/AlbumStore.js'
import SearchStore from './store/SearchStore.js'
import ArtistStore from './store/ArtistStore.js'
import SongStore from './store/SongStore.js'
import LibraryStore from './store/LibraryStore.js'
import HistoryStore from './store/HistoryStore.js'
import ProfileStore from './store/ProfileStore.js'
import PlaylistStore from './store/PlaylistStore.js'
import UserStore from './store/UserStore.js'
import FollowStore from './store/FollowStore.js'
import { AudioPlayerProvider } from 'wavesurf'
import 'wavesurf/styles.css'

export const UserContext = createContext(null)
export const AlbumContext = createContext(null)
export const ArtistContext = createContext(null)
export const SongContext = createContext(null)
export const SearchContext = createContext(null)
export const LibraryContext = createContext(null)
export const HistoryContext = createContext(null)
export const ProfileContext = createContext(null)
export const PlaylistContext = createContext(null)
export const FollowContext = createContext(null)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AudioPlayerProvider>
        <UserContext.Provider value={new UserStore()}>
          <AlbumContext.Provider value={new AlbumStore()}>
            <SearchContext.Provider value={new SearchStore()}>
              <ArtistContext.Provider value={new ArtistStore()}>
                <SongContext.Provider value={new SongStore()}>
                  <LibraryContext.Provider value={new LibraryStore()}>
                    <HistoryContext.Provider value={new HistoryStore()}>
                      <ProfileContext.Provider value={new ProfileStore()}>
                        <PlaylistContext.Provider value={new PlaylistStore()}>
                          <FollowContext.Provider value={new FollowStore()}>
                            <App />
                          </FollowContext.Provider>
                        </PlaylistContext.Provider>
                      </ProfileContext.Provider>
                    </HistoryContext.Provider>
                  </LibraryContext.Provider>
                </SongContext.Provider>
              </ArtistContext.Provider>
            </SearchContext.Provider>
          </AlbumContext.Provider>
        </UserContext.Provider>
      </AudioPlayerProvider>
    </BrowserRouter>
  </StrictMode>
)
