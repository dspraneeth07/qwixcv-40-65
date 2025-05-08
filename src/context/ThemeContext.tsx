
import { createContext, useContext, ReactNode, useState, useEffect } from "react";

type ThemeContextType = {
  theme: string;
};

const ThemeContext = createContext<ThemeContextType>({ theme: 'light' });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme] = useState('light');

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    localStorage.setItem('theme', 'light');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
