import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useParams, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import * as lucideReact from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../Store/DashBoardSlice/AuthSlice'; 

interface SidebarProps {
  isRegistrationCompleted: boolean;
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  disabled?: boolean;
  active?: boolean;
}

const UnifiedSidebar: React.FC<SidebarProps> = ({ isRegistrationCompleted }) => {
  const { t, i18n } = useTranslation();
  const { storeId } = useParams();
  const location = useLocation();
  const isRTL = i18n.language === 'ar';
  const dispatch = useDispatch();

  // Check if we're in a store-specific route
  const isStoreRoute = location.pathname.startsWith('/store/');

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const mainNavItems: NavItem[] = [
    {
      icon: <lucideReact.Home size={20} />,
      label: t('sidebar.home'),
      href: '/',
      active: true,
    },
    {
      icon: <lucideReact.User size={20} />,
      label: t('sidebar.profile'),
      href: '/profile',
    },
    {
      icon: <lucideReact.StoreIcon size={20} />,
      label: t('sidebar.stores'),
      href: '/stores',
    },
    {
      icon: <lucideReact.Ticket size={20} />,
      label: t('sidebar.tickets'),
      href: '/tickets',
    },
    {
      icon: <lucideReact.CreditCard size={20} />,
      label: t('sidebar.plans'),
      href: '/plans',
    },
    {
      icon: <lucideReact.Receipt size={20} />,
      label: t('sidebar.subscriptions'),
      href: '/subscriptions',
    }
  ];

  const storeNavItems: NavItem[] = [
    {
      icon: <lucideReact.Home size={20} />,
      label: t('sidebar.store_home'),
      href: `/store/${storeId}`,
    },
    {
      icon: <lucideReact.Pencil size={20} />,
      label: t('sidebar.content'),
      href: `/store/${storeId}/content-mapping`,
    },
    {
      icon: <lucideReact.Package size={20} />,
      label: t('sidebar.products'),
      href: `/store/${storeId}/products`,
      disabled: !isRegistrationCompleted,
    },
    {
      icon: <lucideReact.FolderTree size={20} />,
      label: t('sidebar.categories'),
      href: `/store/${storeId}/categories`,
      disabled: !isRegistrationCompleted,
    },
    {
      icon: <lucideReact.ShoppingCart size={20} />,
      label: t('sidebar.orders'),
      href: `/store/${storeId}/orders`,
      disabled: !isRegistrationCompleted,
    },
    {
      icon: <lucideReact.Users size={20} />,
      label: t('sidebar.customers'),
      href: `/store/${storeId}/customers`,
      disabled: !isRegistrationCompleted,
    },
    {
      icon: <lucideReact.Truck size={20} />,
      label: t('sidebar.shiping_company'),
      href: `/store/${storeId}/shipping`,
      disabled: !isRegistrationCompleted,
    },
    {
      icon: <lucideReact.Gift size={20} />,
      label: t('sidebar.loyaltyPoints'),
      href: `/store/${storeId}/loyalty`,
      disabled: !isRegistrationCompleted,
    },
    {
      icon: <lucideReact.HandCoins size={20} />,
      label: t('sidebar.payments'),
      href: `/store/${storeId}/payments`,
      disabled: !isRegistrationCompleted,
    },
  ];

  // Choose navigation items based on context
  const navItems = isStoreRoute ? storeNavItems : mainNavItems;

  // Choose logo and title based on context
  const Logo = isStoreRoute ? lucideReact.Store : lucideReact.Package;
  const title = isStoreRoute ? t('sidebar.store_title', { storeId }) : t('sidebar.main_title');

  return (
    <div className={cn(
      "flex flex-col h-screen bg-white shadow-lg",
      "w-64 shrink-0",
      "transition-all duration-300 ease-in-out",
      "border-r border-gray-200",
      isRTL ? "border-l" : "border-r"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center">
            <Logo size={20} className="text-white" />
          </div>
          <span className="text-xl font-semibold">{title}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.href}
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 text-sm rounded-md",
                "transition-colors duration-200",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-700 hover:bg-gray-100",
                item.disabled && "opacity-50 pointer-events-none"
              )}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        {isStoreRoute ? (
          <button
            onClick={() => window.location.href = '/your-stores'}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
          >
            <lucideReact.ArrowLeft size={20} className="mr-3" />
            <span>{t('sidebar.back_to_stores')}</span>
          </button>
        ) : (
          <>
            <button
              onClick={toggleLanguage}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
            >
              <lucideReact.Languages size={20} className="mr-3" />
              <span>{t('sidebar.language')}</span>
            </button>
            <button className="flex items-center w-full px-3 py-2 mt-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
            onClick={() => {
              dispatch(logout());
            }}
            >
              <lucideReact.LogOut size={20} className="mr-3" />
              <span>{t('sidebar.logout')}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UnifiedSidebar;