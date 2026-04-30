import { useContext, useState } from 'react'
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import {HOME_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE} from '../utils/consts'
import { observer } from 'mobx-react-lite';
import { UserContext } from '../main';

const AuthCard = observer(() => {
    const userStore = useContext(UserContext)
    const location = useLocation()
    const navigate = useNavigate()
    const isLogin = location.pathname === LOGIN_ROUTE
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const signIn = async () => {
        let result
        if (isLogin) {
            result = await userStore.login(email, password)
        } else {
            result = await userStore.registration(email, password)
        }
        
        if (result.success) {
            navigate(HOME_ROUTE)
        } else {
            alert(result.error)
        }
    }

    return (
        <div className="relative group w-[85%] max-w-85 lg:max-w-100">
            <div className="absolute -inset-1 bg-linear-to-r from-[#2B7FFF] to-[#1447E6] rounded-2xl lg:rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative p-0.5 bg-linear-to-r from-[#2B7FFF] to-[#1447E6] rounded-2xl lg:rounded-3xl">
                
                <div className="bg-[#0F0F11] rounded-[calc(1rem-1px)] lg:rounded-[calc(1.5rem-1px)] p-5 lg:p-8 h-full w-full">
                    
                    <div className="mb-5 lg:mb-8">
                        <h1 className="text-white text-2xl lg:text-[32px] font-bold">
                            {isLogin ? 'Login to your account' : 'Create an account'}
                        </h1>
                        <p className="text-[#9F9FA9] text-xs lg:text-sm mt-1 lg:mt-2">
                            {isLogin 
                                ? 'Continue with your musical journey'
                                : 'Get started with your musical journey'
                            }
                        </p>
                    </div>

                    <div className="mb-3 lg:mb-5">
                        <label className="block text-[#9F9FA9] text-xs lg:text-sm mb-1">
                            Email
                        </label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-[#161618] border border-white/5 rounded-xl text-white placeholder-[#52525B] text-sm lg:text-base focus:outline-none focus:border-[#2B7FFF]/50 transition-colors"
                        />
                    </div>

                    <div className="mb-5 lg:mb-7">
                        <label className="block text-[#9F9FA9] text-xs lg:text-sm mb-1">
                            Password
                        </label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder={isLogin ? "Enter your password" : "Create a password"}
                            className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-[#161618] border border-white/5 rounded-xl text-white placeholder-[#52525B] text-sm lg:text-base focus:outline-none focus:border-[#2B7FFF]/50 transition-colors"
                        />
                    </div>

                    <button 
                        className="w-full py-2 lg:py-3 bg-linear-to-r from-[#2B7FFF] to-[#1447E6] hover:brightness-110 text-white font-bold rounded-xl transition mb-5 lg:mb-7 text-base lg:text-lg shadow-lg shadow-[#2B7FFF]/20"
                        onClick={signIn}
                    >
                        {isLogin ? 'Login' : 'Create account'}
                    </button>

                    <div className="flex items-center gap-3 mb-5 lg:mb-7">
                        <div className="flex-1 h-px bg-white/5"></div>
                        <span className="text-[#52525B] text-xs lg:text-sm uppercase tracking-widest font-medium">or</span>
                        <div className="flex-1 h-px bg-white/5"></div>
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 py-2 lg:py-3 bg-[#161618] hover:bg-[#1C1C1E] border border-white/5 rounded-xl transition mb-5 lg:mb-7 active:scale-[0.98]">
                        <img 
                            src="/google-icon-logo.svg" 
                            alt="Google" 
                            className="w-4 h-4 lg:w-5 lg:h-5"
                        />
                        <span className="text-white text-sm lg:text-base">Continue with Google</span>
                    </button>

                    <div className="flex justify-center gap-1 text-xs lg:text-sm">
                        <span className="text-[#9F9FA9]">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                        </span>
                        
                        <NavLink
                            to={isLogin ? REGISTRATION_ROUTE : LOGIN_ROUTE }
                            className={({ isActive }) => 
                                `text-[#2B7FFF] hover:text-[#1447E6] font-bold transition ${
                                    isActive ? "underline" : ""
                                }`
                            }
                        >
                            {isLogin ? "Sign up" : "Login"}
                        </NavLink>
                    </div>
                    
                </div>
            </div>
        </div>
    )
})

export default AuthCard