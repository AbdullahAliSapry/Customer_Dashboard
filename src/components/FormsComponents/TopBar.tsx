import { Bell, Settings, User } from 'lucide-react';

const TopBar = () => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-neutral-800">Dashboard</h2>
          <p className="text-sm text-neutral-500">Create and manage your e-commerce website</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full">
            <Bell size={20} />
          </button>
          <button className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full">
            <Settings size={20} />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <span className="text-sm font-medium hidden md:block">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;