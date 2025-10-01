"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";

type Theme = "light" | "dark";

interface ThemeColors {
  // Primary colors
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primaryLight: string;

  // Secondary colors
  secondary: string;
  secondaryHover: string;

  // Accent colors
  accent: string;
  accentHover: string;

  // Background layers
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;

  // Surface colors
  surface: string;
  surfaceHover: string;
  surfaceActive: string;
  surfaceElevated: string;

  // Text colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;
  textLink: string;

  // Border colors
  border: string;
  borderHover: string;
  borderStrong: string;
  divider: string;

  // Status colors
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  info: string;
  infoLight: string;

  // Interactive states
  hover: string;
  active: string;
  focus: string;

  // Chat specific
  chatBackground: string;
  chatBubbleOwn: string;
  chatBubbleOther: string;
  chatBubbleOtherHover: string;
  chatInputBackground: string;
  chatInputBorder: string;

  // Sidebar specific
  sidebarBackground: string;
  sidebarHover: string;
  sidebarActive: string;
  sidebarDivider: string;

  // Modal/Overlay
  overlay: string;
  modalBackground: string;
  modalBorder: string;

  // Orb visual effects
  orbHue: number;
  orbIntensity: number;
  gradientFrom: string;
  gradientTo: string;

  // Skeleton loaders
  skeletonBase: string;
  skeletonHighlight: string;

  // Mention/Highlight
  mentionBackground: string;
  mentionText: string;

  // Online status
  statusOnline: string;
  statusIdle: string;
  statusDnd: string;
  statusOffline: string;
}

const themeConfigs: Record<Theme, ThemeColors> = {
  dark: {
    // Primary - Discord's blurple
    primary: "#5865F2",
    primaryHover: "#4752C4",
    primaryActive: "#3C45A5",
    primaryLight: "#5865F233",

    // Secondary
    secondary: "#8b5cf6",
    secondaryHover: "#7c3aed",

    // Accent
    accent: "#00aff4",
    accentHover: "#0099dc",

    // Backgrounds - Discord's dark theme
    background: "#313338",
    backgroundSecondary: "#2b2d31",
    backgroundTertiary: "#1e1f22",

    // Surfaces
    surface: "#383a40",
    surfaceHover: "#404249",
    surfaceActive: "#4e505a",
    surfaceElevated: "#2b2d31",

    // Text - High contrast for dark mode
    textPrimary: "#f2f3f5",
    textSecondary: "#b5bac1",
    textTertiary: "#949ba4",
    textMuted: "#80848e",
    textLink: "#00a8fc",

    // Borders
    border: "#26272b",
    borderHover: "#3f4147",
    borderStrong: "#4e505a",
    divider: "#26272b",

    // Status
    success: "#23a55a",
    successLight: "#23a55a33",
    warning: "#f0b232",
    warningLight: "#f0b23233",
    error: "#f23f43",
    errorLight: "#f23f4333",
    info: "#5865F2",
    infoLight: "#5865F233",

    // Interactive
    hover: "#35373c",
    active: "#404249",
    focus: "#5865F240",

    // Chat
    chatBackground: "#313338",
    chatBubbleOwn: "linear-gradient(135deg, #5865F2 0%, #7289da 100%)",
    chatBubbleOther: "#2b2d31",
    chatBubbleOtherHover: "#32353b",
    chatInputBackground: "#383a40",
    chatInputBorder: "#26272b",

    // Sidebar
    sidebarBackground: "#2b2d31",
    sidebarHover: "#35373c",
    sidebarActive: "#404249",
    sidebarDivider: "#26272b",

    // Modal
    overlay: "rgba(0, 0, 0, 0.85)",
    modalBackground: "#313338",
    modalBorder: "#26272b",

    // Orb
    orbHue: 235,
    orbIntensity: 0.35,
    gradientFrom: "#5865F2",
    gradientTo: "#7289da",

    // Skeleton
    skeletonBase: "#2b2d31",
    skeletonHighlight: "#383a40",

    // Mention
    mentionBackground: "#5865F233",
    mentionText: "#dee0fc",

    // Status
    statusOnline: "#23a55a",
    statusIdle: "#f0b232",
    statusDnd: "#f23f43",
    statusOffline: "#80848e",
  },

  light: {
    // Primary - Discord's blurple adjusted for light
    primary: "#5865F2",
    primaryHover: "#4752C4",
    primaryActive: "#3C45A5",
    primaryLight: "#5865F215",

    // Secondary
    secondary: "#7c3aed",
    secondaryHover: "#6d28d9",

    // Accent
    accent: "#0099dc",
    accentHover: "#0087c4",

    // Backgrounds - Clean, modern whites
    background: "#ffffff",
    backgroundSecondary: "#f2f3f5",
    backgroundTertiary: "#e3e5e8",

    // Surfaces
    surface: "#f2f3f5",
    surfaceHover: "#e3e5e8",
    surfaceActive: "#d4d7dc",
    surfaceElevated: "#ffffff",

    // Text - WCAG AAA compliant contrast
    textPrimary: "#060607",
    textSecondary: "#4e5058",
    textTertiary: "#5e6772",
    textMuted: "#80848e",
    textLink: "#0067b8",

    // Borders - Visible but not harsh
    border: "#d4d7dc",
    borderHover: "#b5bac1",
    borderStrong: "#9fa6b3",
    divider: "#e3e5e8",

    // Status - Adjusted for light backgrounds
    success: "#1f8b4c",
    successLight: "#1f8b4c15",
    warning: "#e8a723",
    warningLight: "#e8a72315",
    error: "#d93036",
    errorLight: "#d9303615",
    info: "#5865F2",
    infoLight: "#5865F215",

    // Interactive
    hover: "#e3e5e8",
    active: "#d4d7dc",
    focus: "#5865F230",

    // Chat
    chatBackground: "#ffffff",
    chatBubbleOwn: "linear-gradient(135deg, #5865F2 0%, #7289da 100%)",
    chatBubbleOther: "#f2f3f5",
    chatBubbleOtherHover: "#e3e5e8",
    chatInputBackground: "#ffffff",
    chatInputBorder: "#d4d7dc",

    // Sidebar
    sidebarBackground: "#f2f3f5",
    sidebarHover: "#e3e5e8",
    sidebarActive: "#d4d7dc",
    sidebarDivider: "#d4d7dc",

    // Modal
    overlay: "rgba(0, 0, 0, 0.65)",
    modalBackground: "#ffffff",
    modalBorder: "#d4d7dc",

    // Orb
    orbHue: 235,
    orbIntensity: 0.25,
    gradientFrom: "#5865F2",
    gradientTo: "#7289da",

    // Skeleton
    skeletonBase: "#e3e5e8",
    skeletonHighlight: "#f2f3f5",

    // Mention
    mentionBackground: "#5865F215",
    mentionText: "#3C45A5",

    // Status
    statusOnline: "#1f8b4c",
    statusIdle: "#e8a723",
    statusDnd: "#d93036",
    statusOffline: "#80848e",
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

  // Memoize colors to prevent unnecessary recalculations
  const colors = useMemo(() => themeConfigs[theme], [theme]);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem(
      "discord-clone-theme"
    ) as Theme | null;
    if (storedTheme && themeConfigs[storedTheme]) {
      setThemeState(storedTheme);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setThemeState(prefersDark ? "dark" : "light");
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;

    // Update CSS custom properties
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, String(value));
    });

    // Update class-based themes
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);

    // Update background color
    document.body.style.backgroundColor = colors.background;

    // Update meta theme-color for mobile browsers
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.setAttribute("name", "theme-color");
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute("content", colors.background);

    localStorage.setItem("discord-clone-theme", theme);
  }, [theme, colors]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const value = useMemo(
    () => ({ theme, colors, setTheme, toggleTheme }),
    [theme, colors]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
