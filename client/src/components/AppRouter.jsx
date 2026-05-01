import { Routes, Route, Navigate } from "react-router-dom"
import { privateRoutes, publicRoutes } from "../routes"
import { LOGIN_ROUTE } from "../utils/consts"
import { useContext } from "react"
import { observer } from 'mobx-react-lite';
import { UserContext } from "../main"

const AppRouter = observer(() => {
    const user = useContext(UserContext)

    console.log('isAuth:', user.isAuth)

    return (
        <Routes>
            {user.isAuth && privateRoutes.map(({path, element}) => {
                return <Route key={path} path={path} element={element} exact></Route>
            })}
            {publicRoutes.map(({path, element}) => {
                return <Route key={path} path={path} element={element} exact></Route>
            })}

            <Route path="*" element={<Navigate to={LOGIN_ROUTE} />} />
        </Routes>
    )
})

export default AppRouter