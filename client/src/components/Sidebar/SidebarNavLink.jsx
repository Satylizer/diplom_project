import { NavLink } from "react-router-dom";

const SidebarNavLink = ({ to, icon, label }) => {
  const Icon = icon;
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center justify-center lg:justify-start gap-0 lg:gap-3 px-2 lg:px-3 py-2 rounded-[10px] transition-all duration-200 ${
          isActive 
            ? 'bg-[#155DFC]/20 text-[#51A2FF] hover:bg-[rgba(21,93,252,0.4)]' 
            : 'text-[#9F9FA9] hover:bg-[rgba(21,93,252,0.3)]'
        }`
      }
    >
      <Icon className="w-5 h-5 lg:w-5 lg:h-5" />
      <span className="hidden lg:inline text-xs lg:text-base">{label}</span>
    </NavLink>
  )
}

export default SidebarNavLink;