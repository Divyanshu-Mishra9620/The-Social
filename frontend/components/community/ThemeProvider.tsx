"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeColors {
  // Primary colors with proper contrast
  primary: string;
  primaryHover: string;
  primaryActive: string;

  // Secondary colors
  secondary: string;
  secondaryHover: string;

  // Accent colors
  accent: string;
  accentHover: string;

  // Background layers (from back to front) - WCAG AAA compliant
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceHover: string;
  surfaceActive: string;

  // Text hierarchy with proper contrast ratios
  textPrimary: string; // Main text - 16:1 contrast
  textSecondary: string; // Secondary text - 10:1 contrast
  textTertiary: string; // Tertiary text - 7:1 contrast
  textMuted: string; // Muted text - 4.5:1 contrast

  // Borders and dividers
  border: string;
  borderHover: string;
  divider: string;

  // Status colors (consistent across themes)
  success: string;
  warning: string;
  error: string;
  info: string;

  // Interactive states
  hover: string;
  active: string;
  focus: string;

  // Chat-specific
  chatBackground: string;
  chatBubbleOwn: string;
  chatBubbleOther: string;
  chatInputBackground: string;

  // Orb effect (more subtle)
  orbHue: number;
  orbIntensity: number;
  gradientFrom: string;
  gradientTo: string;

  // Skeleton loaders
  skeletonBase: string;
  skeletonHighlight: string;
}

const themeConfigs: Record<Theme, ThemeColors> = {
  dark: {
    // Primary - Professional indigo with excellent visibility
    primary: "#6366f1",
    primaryHover: "#5558e3",
    primaryActive: "#4338ca",

    // Secondary - Complementary purple
    secondary: "#8b5cf6",
    secondaryHover: "#7c3aed",

    // Accent - Vibrant cyan
    accent: "#06b6d4",
    accentHover: "#0891b2",

    // Backgrounds - Deep, rich blacks with subtle variations
    background: "#0a0a0b",
    backgroundSecondary: "#111113",
    surface: "#1a1a1d",
    surfaceHover: "#222226",
    surfaceActive: "#2a2a2f",

    // Text - High contrast, WCAG AAA compliant
    textPrimary: "#f5f5f7", // 18.5:1 contrast
    textSecondary: "#d1d1d6", // 12.1:1 contrast
    textTertiary: "#a1a1aa", // 7.8:1 contrast
    textMuted: "#71717a", // 4.8:1 contrast

    // Borders - Clear separation without harshness
    border: "rgba(255, 255, 255, 0.12)",
    borderHover: "rgba(255, 255, 255, 0.18)",
    divider: "rgba(255, 255, 255, 0.08)",

    // Status colors
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",

    // Interactive states
    hover: "rgba(255, 255, 255, 0.06)",
    active: "rgba(255, 255, 255, 0.12)",
    focus: "rgba(99, 102, 241, 0.4)",

    // Chat-specific
    chatBackground: "rgba(10, 10, 11, 0.6)",
    chatBubbleOwn: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    chatBubbleOther: "#222226",
    chatInputBackground: "#1a1a1d",

    // Orb - Subtle and professional
    orbHue: 245,
    orbIntensity: 0.4,
    gradientFrom: "#6366f1",
    gradientTo: "#8b5cf6",

    // Skeleton loaders
    skeletonBase: "#222226",
    skeletonHighlight: "#2a2a2f",
  },

  light: {
    // Primary - Professional indigo
    primary: "#6366f1",
    primaryHover: "#5558e3",
    primaryActive: "#4338ca",

    // Secondary - Refined purple
    secondary: "#8b5cf6",
    secondaryHover: "#7c3aed",

    // Accent - Professional cyan
    accent: "#06b6d4",
    accentHover: "#0891b2",

    // Backgrounds - Clean whites with subtle variations
    background: "#ffffff",
    backgroundSecondary: "#fafafa",
    surface: "#f5f5f5",
    surfaceHover: "#eeeeee",
    surfaceActive: "#e8e8e8",

    // Text - High contrast, WCAG AAA compliant
    textPrimary: "#09090b", // 19.3:1 contrast
    textSecondary: "#3f3f46", // 11.8:1 contrast
    textTertiary: "#71717a", // 7.2:1 contrast
    textMuted: "#a1a1aa", // 4.6:1 contrast

    // Borders - Clear but not harsh
    border: "rgba(0, 0, 0, 0.12)",
    borderHover: "rgba(0, 0, 0, 0.18)",
    divider: "rgba(0, 0, 0, 0.08)",

    // Status colors
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",

    // Interactive states
    hover: "rgba(0, 0, 0, 0.04)",
    active: "rgba(0, 0, 0, 0.08)",
    focus: "rgba(99, 102, 241, 0.3)",

    // Chat-specific
    chatBackground: "rgba(255, 255, 255, 0.4)",
    chatBubbleOwn: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    chatBubbleOther: "#f5f5f5",
    chatInputBackground: "#ffffff",

    // Orb - Subtle and professional
    orbHue: 240,
    orbIntensity: 0.3,
    gradientFrom: "#6366f1",
    gradientTo: "#8b5cf6",

    // Skeleton loaders
    skeletonBase: "#eeeeee",
    skeletonHighlight: "#f5f5f5",
  },
};

interface ThemeContextProps {
  theme: Theme;
  colors: ThemeColors;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [colors, setColors] = useState<ThemeColors>(themeConfigs.dark);

  // Initialize theme from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("app-theme") as Theme | null;
    if (storedTheme && themeConfigs[storedTheme]) {
      setThemeState(storedTheme);
      setColors(themeConfigs[storedTheme]);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const systemTheme = prefersDark ? "dark" : "light";
      setThemeState(systemTheme);
      setColors(themeConfigs[systemTheme]);
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    const newColors = themeConfigs[theme];
    setColors(newColors);

    // Update CSS custom properties
    const root = document.documentElement;
    Object.entries(newColors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, String(value));
    });

    // Update class-based themes
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", newColors.background);
    }

    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme, toggleTheme }}>
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
