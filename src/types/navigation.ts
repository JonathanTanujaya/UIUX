// Navigation TypeScript Definitions
// For TypeScript projects, create these interfaces

export interface NavigationItem {
  label: string;
  path: string;
  icon?: string;
  category?: string;
  type?: 'item' | 'category' | 'recent' | 'favorite';
  timestamp?: number;
}

export interface NavigationCategory {
  id: string;
  label: string;
  icon: string;
  path?: string;
  color: 'blue' | 'indigo' | 'green' | 'yellow' | 'purple';
  items: NavigationItem[];
}

export interface NavigationConfig {
  [key: string]: NavigationCategory;
}

export interface NavigationContextType {
  // State
  activeCategory: string;
  sidebarOpen: boolean;
  recentItems: NavigationItem[];
  favoriteItems: NavigationItem[];
  searchQuery: string;
  commandPaletteOpen: boolean;

  // Actions
  setActiveCategory: (category: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleFavorite: (item: NavigationItem) => void;
  searchItems: (query: string) => NavigationItem[];

  // Config
  navigationConfig: NavigationConfig;

  // Computed
  activeItems: NavigationItem[];
  activeCategoryConfig: NavigationCategory | undefined;
}

// Component Props Types
export interface TopNavbarProps {}

export interface ContextualSidebarProps {}

export interface CommandPaletteProps {}

export interface ModernLayoutProps {
  children: React.ReactNode;
}

// Hook return type
export interface UseNavigationReturn extends NavigationContextType {}

// Search result type
export interface SearchResult extends NavigationItem {
  type: 'item' | 'category' | 'recent' | 'favorite';
  category?: string;
}
