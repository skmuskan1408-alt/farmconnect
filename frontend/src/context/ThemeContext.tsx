import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeId =
  | 'nature-farm'
  | 'cherry-blossom'
  | 'ocean'
  | 'sky-glimpses'
  | 'desert-wind'
  | 'sunset'
  | 'astra'
  | 'night-farm'
  | 'minimal';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  icon: string;
  description: string;
  previewColors: string[];
  bgGradient: string;
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'nature-farm',
    name: 'Nature Farm',
    icon: '🌿',
    description: 'Fresh green, leaf tones, cream, & natural agriculture visuals',
    previewColors: ['#10b981', '#059669', '#fdfbf7'],
    bgGradient: 'from-emerald-500 to-teal-700'
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    icon: '🌸',
    description: 'Soft blush pink, pale rose, white, & serene sakura vibes',
    previewColors: ['#f472b6', '#fb7185', '#fff5f7'],
    bgGradient: 'from-pink-400 to-rose-500'
  },
  {
    id: 'ocean',
    name: 'Ocean',
    icon: '🌊',
    description: 'Sky blue, deep ocean cyan, white, & wave gradients',
    previewColors: ['#0284c7', '#06b6d4', '#f0f9ff'],
    bgGradient: 'from-sky-500 to-cyan-600'
  },
  {
    id: 'sky-glimpses',
    name: 'Sky Glimpses',
    icon: '☁️',
    description: 'Light blue, cloud lavender, & bright airy atmosphere',
    previewColors: ['#38bdf8', '#a855f7', '#f8fafc'],
    bgGradient: 'from-blue-400 to-purple-400'
  },
  {
    id: 'desert-wind',
    name: 'Desert Wind',
    icon: '🏜️',
    description: 'Sand beige, warm cream, terracotta, & golden earth tones',
    previewColors: ['#d97706', '#b45309', '#fefce8'],
    bgGradient: 'from-amber-600 to-yellow-700'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    icon: '🌅',
    description: 'Peach, soft orange, warm yellow, & sunset gradients',
    previewColors: ['#f97316', '#e11d48', '#fff7ed'],
    bgGradient: 'from-orange-500 to-rose-600'
  },
  {
    id: 'astra',
    name: 'Astra',
    icon: '✨',
    description: 'Elegant purple, deep blue, soft violet, & cosmic glow',
    previewColors: ['#8b5cf6', '#4c1d95', '#0f172a'],
    bgGradient: 'from-violet-600 to-indigo-900'
  },
  {
    id: 'night-farm',
    name: 'Night Farm',
    icon: '🌙',
    description: 'Dark green, deep navy, moonlit atmosphere, high contrast',
    previewColors: ['#065f46', '#0f172a', '#022c22'],
    bgGradient: 'from-emerald-900 via-slate-900 to-teal-950'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    icon: '🤍',
    description: 'Clean white, light slate, subtle green accents, & high clarity',
    previewColors: ['#64748b', '#0f172a', '#ffffff'],
    bgGradient: 'from-slate-600 to-slate-800'
  }
];

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (themeId: ThemeId) => void;
  isPickerOpen: boolean;
  setIsPickerOpen: (open: boolean) => void;
  currentThemeConfig: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'kissanconnect_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId;
    if (saved && THEMES.some(t => t.id === saved)) {
      return saved;
    }
    return 'nature-farm';
  });

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
  };

  const currentThemeConfig = THEMES.find(t => t.id === theme) || THEMES[0];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isPickerOpen,
        setIsPickerOpen,
        currentThemeConfig
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
