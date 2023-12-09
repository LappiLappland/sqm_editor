import { createContext, useEffect, useState } from "react";

type ThemeValues = 'dark' | 'light';

interface ThemeContextI {
  theme: ThemeValues,
  setTheme: React.Dispatch<React.SetStateAction<ThemeValues>>,
}

export const ThemeContext = createContext<ThemeContextI | null>(null);

interface ThemeComponentProps {
  children?: React.ReactNode
}

export default function ThemeComponent({ children }: ThemeComponentProps) {

  const [theme, setTheme] = useState<ThemeValues>(() => {
    const initTheme = localStorage.getItem('theme');
    if (initTheme === 'dark' || initTheme === 'light') {
      return initTheme;
    }
    return 'dark';
  });

  const contextObject: ThemeContextI = {
    theme: theme,
    setTheme: setTheme,
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={contextObject}>
      <div className={`theme-${theme} default-styles`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}