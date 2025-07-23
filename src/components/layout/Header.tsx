import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Crown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <header className={cn(
      "bg-white border-b border-gray-200",
      "py-3 px-4 flex items-center justify-between",
      "sticky top-0 z-10"
    )}>
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 lg:hidden"
        >
          <Menu size={20} />
        </button>
        <h1 className={cn(
          "text-lg font-semibold text-gray-800",
          "md:text-2xl",
          isRTL ? "mr-2" : "ml-2"
        )}>
          {t('dashboard.welcome')}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => window.alert(t('header.upgrade_alert'))}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px', // المسافة بين النص والأيقونة
            padding: '10px 20px',
            backgroundColor: '#059669',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          <span>{t('header.upgrade_plan')}</span>
          <Crown size={16} color="#fff" /> {/* أيقونة Lucide */}
        </button>
      </div>
    </header>
  );
};

export default Header;