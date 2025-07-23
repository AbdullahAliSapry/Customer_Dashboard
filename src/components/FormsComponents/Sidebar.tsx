import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  ShoppingBag, 
  Palette, 
  Layers, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Store
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.div 
      className="bg-white shadow-sm flex flex-col border-r"
      initial={{ width: 240 }}
      animate={{ width: isCollapsed ? 80 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="p-4 border-b flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-2"
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Store className="text-primary-600" size={24} />
          <h1 className={`text-lg font-bold text-neutral-900 ${isCollapsed ? 'hidden' : 'block'}`}>
            SiteBuilder
          </h1>
        </motion.div>
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-neutral-100 text-neutral-500"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          <NavItem to="/" icon={<Home size={20} />} text="Store Creation" isCollapsed={isCollapsed} />
          <NavItem to="/templates" icon={<Layers size={20} />} text="Templates" isCollapsed={isCollapsed} />
          <NavItem to="/colors" icon={<Palette size={20} />} text="Color Themes" isCollapsed={isCollapsed} />
          <NavItem to="/customize" icon={<ShoppingBag size={20} />} text="Sections" isCollapsed={isCollapsed} />
        </ul>
      </nav>
      <div className="p-4 border-t mt-auto">
        <NavItem to="/settings" icon={<Settings size={20} />} text="Settings" isCollapsed={isCollapsed} />
      </div>
    </motion.div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  isCollapsed: boolean;
}

const NavItem = ({ to, icon, text, isCollapsed }: NavItemProps) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) => 
          `flex items-center px-4 py-3 text-sm rounded-md transition-all ${
            isActive 
              ? 'bg-primary-50 text-primary-700 font-medium' 
              : 'text-neutral-600 hover:bg-neutral-100'
          }`
        }
      >
        <span className="mr-3">{icon}</span>
        <motion.span 
          animate={{ opacity: isCollapsed ? 0 : 1, display: isCollapsed ? 'none' : 'block' }}
          transition={{ duration: 0.2 }}
        >
          {text}
        </motion.span>
      </NavLink>
    </li>
  );
};

export default Sidebar;