import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type MouseColor = 'cyan' | 'orange' | 'purple' | 'green' | 'white' | 'dual';
export type MouseSize = 'small' | 'medium' | 'large';
export type ThemeMode = 'dark' | 'light';
export type FontSize = 'small' | 'normal' | 'large';

// These correspond to HEX values for the theme
export const THEME_COLORS: Record<string, string> = {
  cyan: '#00E5FF',
  orange: '#FF5E00',
  purple: '#A855F7',
  green: '#10B981',
  blue: '#3B82F6',
  pink: '#EC4899',
  red: '#EF4444',
  white: '#FAFAFA'
};

interface SettingsContextType {
  mouseEffect: boolean;
  setMouseEffect: (enabled: boolean) => void;
  performanceMode: boolean;
  setPerformanceMode: (enabled: boolean) => void;
  mouseColor: MouseColor;
  setMouseColor: (color: MouseColor) => void;
  mouseSize: MouseSize;
  setMouseSize: (size: MouseSize) => void;
  appPrimaryColor: string;
  setAppPrimaryColor: (color: string) => void;
  appSecondaryColor: string;
  setAppSecondaryColor: (color: string) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  animations: boolean;
  setAnimations: (enabled: boolean) => void;
  glassmorphism: boolean;
  setGlassmorphism: (enabled: boolean) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [mouseEffect, setMouseEffectState] = useState(() => {
    const saved = localStorage.getItem('uefn-mouse-effect');
    return saved ? saved === 'true' : false; // Default off
  });

  const [performanceMode, setPerformanceModeState] = useState(() => {
    const saved = localStorage.getItem('uefn-performance-mode');
    return saved ? saved === 'true' : false;
  });

  const [mouseColor, setMouseColorState] = useState<MouseColor>(() => {
    const saved = localStorage.getItem('uefn-mouse-color');
    return (saved as MouseColor) || 'dual';
  });

  const [mouseSize, setMouseSizeState] = useState<MouseSize>(() => {
    const saved = localStorage.getItem('uefn-mouse-size');
    return (saved as MouseSize) || 'medium';
  });

  const [appPrimaryColor, setAppPrimaryColorState] = useState(() => {
    return localStorage.getItem('uefn-primary-color') || 'cyan';
  });

  const [appSecondaryColor, setAppSecondaryColorState] = useState(() => {
    return localStorage.getItem('uefn-secondary-color') || 'orange';
  });

  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('uefn-theme-mode') as ThemeMode) || 'dark';
  });

  const [animations, setAnimationsState] = useState(() => {
    const saved = localStorage.getItem('uefn-animations');
    return saved ? saved === 'true' : true;
  });

  const [glassmorphism, setGlassmorphismState] = useState(() => {
    const saved = localStorage.getItem('uefn-glassmorphism');
    return saved ? saved === 'true' : true;
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem('uefn-font-size') as FontSize) || 'normal';
  });

  const setMouseEffect = (enabled: boolean) => {
    setMouseEffectState(enabled);
    localStorage.setItem('uefn-mouse-effect', String(enabled));
  };

  const setPerformanceMode = (enabled: boolean) => {
    setPerformanceModeState(enabled);
    localStorage.setItem('uefn-performance-mode', String(enabled));
  };

  const setMouseColor = (color: MouseColor) => {
    setMouseColorState(color);
    localStorage.setItem('uefn-mouse-color', color);
  };

  const setMouseSize = (size: MouseSize) => {
    setMouseSizeState(size);
    localStorage.setItem('uefn-mouse-size', size);
  };

  const setAppPrimaryColor = (color: string) => {
    setAppPrimaryColorState(color);
    localStorage.setItem('uefn-primary-color', color);
  };

  const setAppSecondaryColor = (color: string) => {
    setAppSecondaryColorState(color);
    localStorage.setItem('uefn-secondary-color', color);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('uefn-theme-mode', mode);
  };

  const setAnimations = (enabled: boolean) => {
    setAnimationsState(enabled);
    localStorage.setItem('uefn-animations', String(enabled));
  };

  const setGlassmorphism = (enabled: boolean) => {
    setGlassmorphismState(enabled);
    localStorage.setItem('uefn-glassmorphism', String(enabled));
  };

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem('uefn-font-size', size);
  };

  // Apply colors and classes to root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--epic-cyan', THEME_COLORS[appPrimaryColor] || THEME_COLORS.cyan);
    root.style.setProperty('--unreal-orange', THEME_COLORS[appSecondaryColor] || THEME_COLORS.orange);
    
    if (themeMode === 'light') {
      root.classList.add('uefn-light');
    } else {
      root.classList.remove('uefn-light');
    }

    if (!animations) {
      root.classList.add('no-animations');
    } else {
      root.classList.remove('no-animations');
    }

    if (!glassmorphism) {
      root.classList.add('no-glass');
    } else {
      root.classList.remove('no-glass');
    }

    if (fontSize === 'small') {
      root.style.fontSize = '14px';
    } else if (fontSize === 'large') {
      root.style.fontSize = '18px';
    } else {
      root.style.fontSize = '16px';
    }
  }, [appPrimaryColor, appSecondaryColor, themeMode, animations, glassmorphism, fontSize]);

  return (
    <SettingsContext.Provider value={{ 
      mouseEffect, setMouseEffect, 
      performanceMode, setPerformanceMode,
      mouseColor, setMouseColor,
      mouseSize, setMouseSize,
      appPrimaryColor, setAppPrimaryColor,
      appSecondaryColor, setAppSecondaryColor,
      themeMode, setThemeMode,
      animations, setAnimations,
      glassmorphism, setGlassmorphism,
      fontSize, setFontSize
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
