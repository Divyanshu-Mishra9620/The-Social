"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Theme = "light" | "dark" | "neon" | "ocean" | "sunset";

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  orbHue: number;
  gradientFrom: string;
  gradientTo: string;
}

const themeConfigs: Record<Theme, ThemeColors> = {
  dark: {
    primary: "#6366f1",
    secondary: "#8b5cf6",
    accent: "#06b6d4",
    background: "rgba(0, 0, 0, 0.95)",
    surface: "rgba(15, 15, 15, 0.8)",
    text: "#ffffff",
    textSecondary: "#a1a1aa",
    border: "rgba(255, 255, 255, 0.1)",
    orbHue: 260,
    gradientFrom: "#4338ca",
    gradientTo: "#7c3aed",
  },
  light: {
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    accent: "#10b981",
    background: "rgba(255, 255, 255, 0.95)",
    surface: "rgba(248, 250, 252, 0.9)",
    text: "#0f172a",
    textSecondary: "#64748b",
    border: "rgba(0, 0, 0, 0.1)",
    orbHue: 200,
    gradientFrom: "#3b82f6",
    gradientTo: "#8b5cf6",
  },
  neon: {
    primary: "#00ff88",
    secondary: "#ff0080",
    accent: "#00ffff",
    background: "rgba(0, 0, 0, 0.98)",
    surface: "rgba(10, 10, 30, 0.9)",
    text: "#00ff88",
    textSecondary: "#88ffaa",
    border: "rgba(0, 255, 136, 0.2)",
    orbHue: 140,
    gradientFrom: "#00ff88",
    gradientTo: "#ff0080",
  },
  ocean: {
    primary: "#0ea5e9",
    secondary: "#06b6d4",
    accent: "#8b5cf6",
    background: "rgba(2, 6, 23, 0.95)",
    surface: "rgba(15, 23, 42, 0.8)",
    text: "#e2e8f0",
    textSecondary: "#94a3b8",
    border: "rgba(14, 165, 233, 0.2)",
    orbHue: 200,
    gradientFrom: "#0ea5e9",
    gradientTo: "#06b6d4",
  },
  sunset: {
    primary: "#f97316",
    secondary: "#ef4444",
    accent: "#eab308",
    background: "rgba(20, 10, 5, 0.95)",
    surface: "rgba(45, 25, 15, 0.8)",
    text: "#fef3c7",
    textSecondary: "#fde68a",
    border: "rgba(249, 115, 22, 0.2)",
    orbHue: 20,
    gradientFrom: "#f97316",
    gradientTo: "#ef4444",
  },
};

interface ThemeContextProps {
  theme: Theme;
  colors: ThemeColors;
  setTheme: (theme: Theme) => void;
  nextTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [colors, setColors] = useState<ThemeColors>(themeConfigs.dark);

  useEffect(() => {
    const storedTheme = localStorage.getItem("app-theme") as Theme | null;
    if (storedTheme && themeConfigs[storedTheme]) {
      setThemeState(storedTheme);
      setColors(themeConfigs[storedTheme]);
    }
  }, []);

  useEffect(() => {
    const newColors = themeConfigs[theme];
    setColors(newColors);

    // Update CSS custom properties
    const root = document.documentElement;
    Object.entries(newColors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // Update class-based themes
    document.documentElement.classList.remove(
      "light",
      "dark",
      "neon",
      "ocean",
      "sunset"
    );
    document.documentElement.classList.add(theme);

    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const themes: Theme[] = ["dark", "light", "neon", "ocean", "sunset"];
  const nextTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme, nextTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
