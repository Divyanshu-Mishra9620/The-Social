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
  primary: string;
  primaryHover: string;
  primaryActive: string;

  secondary: string;
  secondaryHover: string;

  accent: string;
  accentHover: string;

  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceHover: string;
  surfaceActive: string;

  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;

  border: string;
  borderHover: string;
  divider: string;

  success: string;
  warning: string;
  error: string;
  info: string;

  hover: string;
  active: string;
  focus: string;

  chatBackground: string;
  chatBubbleOwn: string;
  chatBubbleOther: string;
  chatInputBackground: string;

  orbHue: number;
  orbIntensity: number;
  gradientFrom: string;
  gradientTo: string;

  skeletonBase: string;
  skeletonHighlight: string;
}

const themeConfigs: Record<Theme, ThemeColors> = {
  dark: {
    primary: "#6366f1",
    primaryHover: "#5558e3",
    primaryActive: "#4338ca",

    secondary: "#8b5cf6",
    secondaryHover: "#7c3aed",

    accent: "#06b6d4",
    accentHover: "#0891b2",

    background: "#0a0a0b",
    backgroundSecondary: "#111113",
    surface: "#1a1a1d",
    surfaceHover: "#222226",
    surfaceActive: "#2a2a2f",

    textPrimary: "#f5f5f7",
    textSecondary: "#d1d1d6",
    textTertiary: "#a1a1aa",
    textMuted: "#71717a",

    border: "rgba(255, 255, 255, 0.12)",
    borderHover: "rgba(255, 255, 255, 0.18)",
    divider: "rgba(255, 255, 255, 0.08)",

    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",

    hover: "rgba(255, 255, 255, 0.06)",
    active: "rgba(255, 255, 255, 0.12)",
    focus: "rgba(99, 102, 241, 0.4)",

    chatBackground: "rgba(10, 10, 11, 0.6)",
    chatBubbleOwn: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    chatBubbleOther: "#222226",
    chatInputBackground: "#1a1a1d",

    orbHue: 245,
    orbIntensity: 0.4,
    gradientFrom: "#6366f1",
    gradientTo: "#8b5cf6",

    // Skeleton loaders
    skeletonBase: "#222226",
    skeletonHighlight: "#2a2a2f",
  },

  light: {
    // Primary - Vibrant blue that works on light backgrounds
    primary: "#4f46e5",
    primaryHover: "#4338ca",
    primaryActive: "#3730a3",

    // Secondary - Rich purple
    secondary: "#7c3aed",
    secondaryHover: "#6d28d9",

    // Accent - Teal accent
    accent: "#0891b2",
    accentHover: "#0e7490",

    // Backgrounds - Clean, professional whites
    background: "#ffffff",
    backgroundSecondary: "#fafafa",
    surface: "#f8f9fa",
    surfaceHover: "#f1f3f5",
    surfaceActive: "#e9ecef",

    // Text - FIXED: High contrast for excellent readability
    textPrimary: "#111827", // Deep gray-black for main text
    textSecondary: "#374151", // Dark gray for secondary text
    textTertiary: "#6b7280", // Medium gray for tertiary text
    textMuted: "#9ca3af", // Light gray for muted text

    // Borders - Visible but subtle
    border: "#e5e7eb",
    borderHover: "#d1d5db",
    divider: "#f3f4f6",

    // Status colors
    success: "#059669",
    warning: "#d97706",
    error: "#dc2626",
    info: "#2563eb",

    // Interactive states
    hover: "rgba(0, 0, 0, 0.04)",
    active: "rgba(0, 0, 0, 0.08)",
    focus: "rgba(79, 70, 229, 0.2)",

    // Chat-specific
    chatBackground: "#fafafa",
    chatBubbleOwn: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    chatBubbleOther: "#ffffff",
    chatInputBackground: "#ffffff",

    // Orb - Subtle and elegant
    orbHue: 240,
    orbIntensity: 0.25,
    gradientFrom: "#4f46e5",
    gradientTo: "#7c3aed",

    // Skeleton loaders
    skeletonBase: "#e5e7eb",
    skeletonHighlight: "#f3f4f6",
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
