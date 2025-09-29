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
    // Primary colors - Professional blue with proper contrast
    primary: "#4f46e5",
    primaryHover: "#4338ca",
    primaryActive: "#3730a3",

    // Secondary colors - Refined indigo
    secondary: "#6366f1",
    secondaryHover: "#4f46e5",

    // Accent colors - Subtle cyan
    accent: "#0ea5e9",
    accentHover: "#0284c7",

    // Background layers - Professional dark with depth
    background: "#0f0f11",
    backgroundSecondary: "#18181b",
    surface: "rgba(24, 24, 27, 0.98)",
    surfaceHover: "rgba(39, 39, 42, 0.98)",
    surfaceActive: "rgba(52, 52, 57, 0.98)",

    // Text hierarchy - WCAG AAA compliant
    textPrimary: "#f8fafc",
    textSecondary: "#cbd5e1",
    textTertiary: "#94a3b8",
    textMuted: "#64748b",

    // Borders - Clear visual separation
    border: "rgba(71, 85, 105, 0.3)",
    borderHover: "rgba(100, 116, 139, 0.4)",
    divider: "rgba(71, 85, 105, 0.2)",

    // Status colors
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",

    // Interactive states
    hover: "rgba(255, 255, 255, 0.06)",
    active: "rgba(255, 255, 255, 0.12)",
    focus: "rgba(79, 70, 229, 0.35)",

    // Chat-specific
    chatBackground: "rgba(15, 15, 17, 0.5)",
    chatBubbleOwn: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
    chatBubbleOther: "rgba(39, 39, 42, 0.98)",
    chatInputBackground: "rgba(24, 24, 27, 0.95)",

    // Orb effect
    orbHue: 245,
    gradientFrom: "#4f46e5",
    gradientTo: "#6366f1",

    // Skeleton loaders
    skeletonBase: "rgba(39, 39, 42, 0.6)",
    skeletonHighlight: "rgba(52, 52, 57, 0.6)",
  },

  light: {
    // Primary colors - Professional indigo
    primary: "#4f46e5",
    primaryHover: "#4338ca",
    primaryActive: "#3730a3",

    // Secondary colors - Refined purple
    secondary: "#6366f1",
    secondaryHover: "#4f46e5",

    // Accent colors - Professional sky blue
    accent: "#0284c7",
    accentHover: "#0369a1",

    // Background layers - Clean, professional whites
    background: "#ffffff",
    backgroundSecondary: "#f8fafc",
    surface: "rgba(255, 255, 255, 0.98)",
    surfaceHover: "rgba(248, 250, 252, 0.98)",
    surfaceActive: "rgba(241, 245, 249, 0.98)",

    // Text hierarchy - Professional readability
    textPrimary: "#0f172a",
    textSecondary: "#334155",
    textTertiary: "#64748b",
    textMuted: "#94a3b8",

    // Borders - Defined but subtle
    border: "rgba(203, 213, 225, 0.6)",
    borderHover: "rgba(148, 163, 184, 0.5)",
    divider: "rgba(226, 232, 240, 0.5)",

    // Status colors
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",

    // Interactive states
    hover: "rgba(15, 23, 42, 0.04)",
    active: "rgba(15, 23, 42, 0.08)",
    focus: "rgba(79, 70, 229, 0.2)",

    // Chat-specific
    chatBackground: "rgba(255, 255, 255, 0.3)",
    chatBubbleOwn: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
    chatBubbleOther: "rgba(248, 250, 252, 0.98)",
    chatInputBackground: "rgba(255, 255, 255, 0.95)",

    // Orb effect
    orbHue: 240,
    gradientFrom: "#4f46e5",
    gradientTo: "#6366f1",

    // Skeleton loaders
    skeletonBase: "rgba(226, 232, 240, 0.7)",
    skeletonHighlight: "rgba(241, 245, 249, 0.9)",
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
