import { 
    HISTORY_ROUTE, 
    HOME_ROUTE, 
    LIBRARY_ROUTE, 
    LIKES_ROUTE, 
    LOGIN_ROUTE, 
    REGISTRATION_ROUTE, 
    SEARCH_ROUTE, 
    PROFILE_ROUTE,
    ALBUM_ROUTE,
    PLAYLIST_ROUTE
} from "./utils/consts";
import Auth from "./pages/Auth"
import Profile from "./pages/Profile"
import Library from "./pages/Library"
import Likes from "./pages/Likes"
import History from "./pages/History"
import Home from "./pages/Home"
import Search from "./pages/Search"
import Album from "./pages/Album"
import Playlist from "./pages/Playlist"

export const privateRoutes = [
    {
        path: PROFILE_ROUTE,
        element: <Profile/>
    },
    {
        path: LIBRARY_ROUTE,
        element: <Library/>
    },
    {
        path: LIKES_ROUTE,
        element: <Likes/>
    },
    {
        path: HISTORY_ROUTE,
        element: <History/>
    },
    {
        path: HOME_ROUTE,
        element: <Home/>
    },
    {
        path: SEARCH_ROUTE,
        element: <Search/>
    },
    {
        path: ALBUM_ROUTE + '/:id',
        element: <Album/>
    },
    {
        path: PLAYLIST_ROUTE + '/:id',
        element: <Playlist/>
    },
]

export const publicRoutes = [
    {
        path: REGISTRATION_ROUTE,
        element: <Auth/>
    },
    {
        path: LOGIN_ROUTE,
        element: <Auth/>
    },
]