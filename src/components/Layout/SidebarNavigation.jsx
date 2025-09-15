import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  Undo, 
  DollarSign, 
  Package, 
  Gift, 
  AlertTriangle, 
  RefreshCw,
  Tag,
  Settings,
  CheckCircle,
  MapPin,
  Users,
  Truck,
  Building,
  CreditCard,
  Inbox,
  Clock,
  PlusCircle,
  MinusCircle,
  BarChart3,
  ShoppingBag,
  Banknote
} from 'lucide-react';
import { useNavigation } from '../../contexts/NavigationContext';

// Icon mapping for Lucide React icons
const iconMap = {
  // Transaction icons
  ShoppingCartIcon: ShoppingCart,
  UndoIcon: Undo,
  DollarSignIcon: DollarSign,
  PackageIcon: Package,
  GiftIcon: Gift,
  AlertTriangleIcon: AlertTriangle,
  RefreshCwIcon: RefreshCw,
  
  // Master Data icons
  TagIcon: Tag,
  CogIcon: Settings,
  CheckCircleIcon: CheckCircle,
  MapPinIcon: MapPin,
  UserGroupIcon: Users,
  TruckIcon: Truck,
  UsersIcon: Users,
  BuildingLibraryIcon: Building,
  CreditCardIcon: CreditCard,
  
  // Finance icons
  InboxIcon: Inbox,
  ClockIcon: Clock,
  ArrowPathIcon: RefreshCw,
  PlusCircleIcon: PlusCircle,
  MinusCircleIcon: MinusCircle,
  
  // Reports icons
  CubeIcon: Package,
  ChartBarIcon: BarChart3,
  ShoppingBagIcon: ShoppingBag,
  BanknotesIcon: Banknote,
};

const SidebarNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeItems, activeCategoryConfig, activeCategory } = useNavigation();

  const handleItemClick = (item) => {
    navigate(item.path);
  };

  const isActiveItem = (path) => {
    return location.pathname === path;
  };

  // Hide sidebar for dashboard
  if (activeCategoryConfig?.id === 'dashboard' || !activeCategoryConfig) {
    return null;
  }

  // Define color schemes for different categories
  const getColorScheme = (categoryId) => {
    switch (categoryId) {
      case 'master':
        return {
          activeClass: 'bg-indigo-50 border-l-4 border-indigo-500',
          iconActiveClass: 'bg-indigo-100 text-indigo-600',
          iconInactiveClass: 'bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600',
          textActiveClass: 'text-indigo-900',
          textInactiveClass: 'text-gray-700 group-hover:text-indigo-900'
        };
      case 'transactions':
        return {
          activeClass: 'bg-blue-50 border-l-4 border-blue-500',
          iconActiveClass: 'bg-blue-100 text-blue-600',
          iconInactiveClass: 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600',
          textActiveClass: 'text-blue-900',
          textInactiveClass: 'text-gray-700 group-hover:text-blue-900'
        };
      case 'finance':
        return {
          activeClass: 'bg-yellow-50 border-l-4 border-yellow-500',
          iconActiveClass: 'bg-yellow-100 text-yellow-600',
          iconInactiveClass: 'bg-gray-100 text-gray-600 group-hover:bg-yellow-100 group-hover:text-yellow-600',
          textActiveClass: 'text-yellow-900',
          textInactiveClass: 'text-gray-700 group-hover:text-yellow-900'
        };
      case 'reports':
        return {
          activeClass: 'bg-purple-50 border-l-4 border-purple-500',
          iconActiveClass: 'bg-purple-100 text-purple-600',
          iconInactiveClass: 'bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600',
          textActiveClass: 'text-purple-900',
          textInactiveClass: 'text-gray-700 group-hover:text-purple-900'
        };
      default:
        return {
          activeClass: 'bg-blue-50 border-l-4 border-blue-500',
          iconActiveClass: 'bg-blue-100 text-blue-600',
          iconInactiveClass: 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600',
          textActiveClass: 'text-blue-900',
          textInactiveClass: 'text-gray-700 group-hover:text-blue-900'
        };
    }
  };

  const colorScheme = getColorScheme(activeCategory);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="px-6 pb-6">
        {/* Category Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {activeCategoryConfig?.label || 'Navigation'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {activeItems.length} menu tersedia
          </p>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {activeItems.map((item) => {
            const IconComponent = iconMap[item.icon];
            const isActive = isActiveItem(item.path);
            
            return (
              <div
                key={item.path}
                onClick={() => handleItemClick(item)}
                className={`group relative cursor-pointer rounded-xl p-4 transition-all duration-200 ${
                  isActive
                    ? `${colorScheme.activeClass} shadow-sm`
                    : 'bg-white hover:bg-gray-50 shadow-sm hover:shadow-md border border-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isActive
                      ? colorScheme.iconActiveClass
                      : colorScheme.iconInactiveClass
                  } transition-colors duration-200`}>
                    {IconComponent && <IconComponent className="w-5 h-5" />}
                  </div>
                  <span className={`font-medium ${
                    isActive
                      ? colorScheme.textActiveClass
                      : colorScheme.textInactiveClass
                  } transition-colors duration-200`}>
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default SidebarNavigation;
