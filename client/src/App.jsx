import { observer } from "mobx-react-lite"
import AppRouter from "./components/AppRouter"
import { BrowserRouter } from "react-router-dom"
import { useContext, useEffect } from "react"
import { UserContext } from "./main"


const App = observer(() => {
    const userStore = useContext(UserContext)
    
    useEffect(() => {
        const init = async () => {
            await userStore.checkAuth()
            console.log("check");
        }
        init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userStore.user?.id])

    if (userStore.isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#09090B]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#27272A] border-t-[#2B7FFF] rounded-full animate-spin"></div>
                    <p className="text-[#9F9FA9] text-sm animate-pulse">Loading...</p>
                </div>
            </div>
        )
    }

    return ( <AppRouter /> )
})

export default App