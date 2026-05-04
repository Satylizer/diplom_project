import { NavLink } from 'react-router-dom';
import { 
  HiOutlineHome,
  HiOutlineMagnifyingGlass, 
  HiOutlineBookOpen,
  HiOutlineHeart,
  HiOutlineClock
} from 'react-icons/hi2';
import SidebarNavLink from './SidebarNavLink';

const Sidebar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 lg:top-0 lg:sticky lg:w-64 bg-[#0d0d0f] border-t lg:border-r border-[#27272A] flex flex-row lg:flex-col justify-around lg:justify-start items-center lg:items-stretch h-auto lg:h-screen z-40 p-2 lg:p-6 transition-all duration-300">

      <NavLink
        to="/" 
        className="hidden lg:flex items-center gap-2 mb-10 hover:opacity-80 transition-opacity duration-200"
      >
        <div className="w-8 h-8 rounded-[10px] bg-linear-to-br from-[#2B7FFF] to-[#1447E6] flex items-center justify-center">
          <img 
            src="/waveform.svg" 
            alt="WaveForm Logo"
            className="w-4 h-4"
          />
        </div>
        <h1 className="text-xl font-bold bg-linear-to-r from-[#2B7FFF] to-[#1447E6] bg-clip-text text-transparent">
          WaveForm
        </h1>
      </NavLink>

      <div className="flex flex-row lg:flex-col gap-4 lg:gap-1 flex-1 justify-between lg:justify-start">
        <SidebarNavLink to="/" icon={HiOutlineHome} label="Home" />
        <SidebarNavLink to="/search" icon={HiOutlineMagnifyingGlass} label="Search" />
        <SidebarNavLink to="/library" icon={HiOutlineBookOpen} label="Library" />
        
        <div className="hidden lg:block h-px bg-[#27272A] my-3"></div>
        
        <SidebarNavLink to="/likes" icon={HiOutlineHeart} label="Liked Songs" />
        <SidebarNavLink to="/history" icon={HiOutlineClock} label="History" />
      </div>
    </div>
  );  
};

export default Sidebar;