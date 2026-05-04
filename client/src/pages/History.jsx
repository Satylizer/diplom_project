import { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import Sidebar from '../components/Sidebar/Sidebar'
import ProfileMenu from '../components/ProfileMenu'
import SongGrid from '../components/Song/SongGrid'
import { HistoryContext, UserContext } from '../main'
import { FaClock } from 'react-icons/fa'

const History = observer(() => {
    const historyStore = useContext(HistoryContext)
    const userStore = useContext(UserContext)

    useEffect(() => {
        historyStore.fetchHistory()
    }, [historyStore, userStore.user?.id])

    if (historyStore.isLoading) {
        return (
            <div className="flex bg-[#121212] min-h-screen">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-[#27272A] border-t-[#2B7FFF] rounded-full animate-spin" />
                </div>
            </div>
        )
    }

    const historySongs = historyStore.history?.map(item => item.song).filter(song => song) || []

    return (
        <div className="flex bg-[#121212] min-h-screen text-white overflow-hidden">
            <Sidebar />
            <div className="flex-1 relative flex flex-col h-screen overflow-y-auto bg-[#121212]">                
                <div className="relative z-20">
                    <ProfileMenu />
                </div>

                <div className="relative z-10 px-12 pt-32 pb-12">
                    <div className="mb-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-white text-5xl md:text-6xl font-bold tracking-tight mb-2">
                                    History
                                </h1>
                                <p className="text-[#9F9FA9] text-md ml-1.5">
                                    Your recently played tracks
                                </p>
                            </div>
                        </div>
                    </div>

                    {historySongs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <FaClock className="w-10 h-10 text-white/40" />
                            </div>
                            <h3 className="text-white text-xl font-semibold mb-2">No recently played songs</h3>
                            <p className="text-[#9F9FA9] text-sm">Start listening to music to see your history here</p>
                        </div>
                    ) : (
                        <SongGrid songs={historySongs} showAlbum={true} />
                    )}
                </div>
            </div>  
        </div>
    )
})

export default History