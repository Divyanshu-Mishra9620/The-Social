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
  // Primary colors
  primary: string;
  primaryHover: string;
  primaryActive: string;

  // Secondary colors
  secondary: string;
  secondaryHover: string;

  // Accent colors
  accent: string;
  accentHover: string;

  // Background layers (from back to front)
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceHover: string;
  surfaceActive: string;

  // Text hierarchy
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;

  // Borders and dividers
  border: string;
  borderHover: string;
  divider: string;

  // Status colors
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

  // Orb effect
  orbHue: number;
  gradientFrom: string;
  gradientTo: string;

  // Skeleton loaders
  skeletonBase: string;
  skeletonHighlight: string;
}

const themeConfigs: Record<Theme, ThemeColors> = {
  dark: {
    // Primary colors - Vibrant blue for CTAs
    primary: "#3b82f6",
    primaryHover: "#2563eb",
    primaryActive: "#1d4ed8",

    // Secondary colors - Purple accent
    secondary: "#8b5cf6",
    secondaryHover: "#7c3aed",

    // Accent colors - Cyan for highlights
    accent: "#06b6d4",
    accentHover: "#0891b2",

    // Background layers - Deep, rich blacks with subtle variations
    background: "#0a0a0a",
    backgroundSecondary: "#121212",
    surface: "rgba(24, 24, 27, 0.95)",
    surfaceHover: "rgba(39, 39, 42, 0.95)",
    surfaceActive: "rgba(63, 63, 70, 0.95)",

    // Text hierarchy - Optimized for WCAG AAA compliance
    textPrimary: "#fafafa",
    textSecondary: "#e4e4e7",
    textTertiary: "#a1a1aa",
    textMuted: "#71717a",

    // Borders - Subtle but visible
    border: "rgba(63, 63, 70, 0.4)",
    borderHover: "rgba(82, 82, 91, 0.6)",
    divider: "rgba(63, 63, 70, 0.3)",

    // Status colors
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",

    // Interactive states
    hover: "rgba(255, 255, 255, 0.05)",
    active: "rgba(255, 255, 255, 0.1)",
    focus: "rgba(59, 130, 246, 0.4)",

    // Chat-specific
    chatBackground: "rgba(10, 10, 10, 0.6)",
    chatBubbleOwn: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    chatBubbleOther: "rgba(39, 39, 42, 0.95)",
    chatInputBackground: "rgba(24, 24, 27, 0.8)",

    // Orb effect
    orbHue: 220,
    gradientFrom: "#3b82f6",
    gradientTo: "#8b5cf6",

    // Skeleton loaders
    skeletonBase: "rgba(39, 39, 42, 0.5)",
    skeletonHighlight: "rgba(63, 63, 70, 0.5)",
  },

  light: {
    // Primary colors - Professional blue
    primary: "#2563eb",
    primaryHover: "#1d4ed8",
    primaryActive: "#1e40af",

    // Secondary colors - Elegant purple
    secondary: "#7c3aed",
    secondaryHover: "#6d28d9",

    // Accent colors - Fresh teal
    accent: "#0891b2",
    accentHover: "#0e7490",

    // Background layers - Clean, bright whites with warmth
    background: "#ffffff",
    backgroundSecondary: "#f9fafb",
    surface: "rgba(255, 255, 255, 0.95)",
    surfaceHover: "rgba(249, 250, 251, 0.95)",
    surfaceActive: "rgba(243, 244, 246, 0.95)",

    // Text hierarchy - Optimized for readability
    textPrimary: "#0f172a",
    textSecondary: "#334155",
    textTertiary: "#64748b",
    textMuted: "#94a3b8",

    // Borders - Visible but not harsh
    border: "rgba(226, 232, 240, 0.8)",
    borderHover: "rgba(203, 213, 225, 0.9)",
    divider: "rgba(226, 232, 240, 0.6)",

    // Status colors
    success: "#059669",
    warning: "#d97706",
    error: "#dc2626",
    info: "#2563eb",

    // Interactive states
    hover: "rgba(0, 0, 0, 0.04)",
    active: "rgba(0, 0, 0, 0.08)",
    focus: "rgba(37, 99, 235, 0.2)",

    // Chat-specific
    chatBackground: "rgba(255, 255, 255, 0.4)",
    chatBubbleOwn: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
    chatBubbleOther: "rgba(243, 244, 246, 0.95)",
    chatInputBackground: "rgba(255, 255, 255, 0.9)",

    // Orb effect
    orbHue: 210,
    gradientFrom: "#3b82f6",
    gradientTo: "#8b5cf6",

    // Skeleton loaders
    skeletonBase: "rgba(226, 232, 240, 0.6)",
    skeletonHighlight: "rgba(241, 245, 249, 0.8)",
  },
};

interface ThemeContextProps {
  theme: Theme;
  colors: ThemeColors;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  nextTheme: () => void; // Add this
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

  const nextTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider
      value={{ theme, colors, setTheme, toggleTheme, nextTheme }}
    >
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
