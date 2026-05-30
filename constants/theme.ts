// Block Share App v2.0 - Theme Constants
// Simplified UX with distinct section colors for visual cues

export const COLORS = {
  // Brand colors
  primary: '#2E5A4C',
  secondary: '#4A7C6F',
  accent: '#D35400',
  text: '#2C3E50',
  textLight: '#7F8C8D',
  white: '#FFFFFF',
  background: '#F5F7FA',
  border: '#E0E6ED',
  
  // Section-specific colors (for visual cue system)
  home: '#3498DB',      // Blue - Dashboard/Home
  pools: '#27AE60',     // Green - Sharing Pools (Stuff tab)
  food: '#E74C3C',      // Red/Warm - Food Collective
  community: '#9B59B6', // Purple - Community/Governance
  profile: '#F39C12',   // Orange - Profile/Settings (Me tab)
  host: '#1ABC9C',      // Teal - Host Functions
  
  // Status colors
  success: '#27AE60',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB',
  
  // Item availability
  available: '#27AE60',
  borrowed: '#F39C12',
  unavailable: '#95A5A6',
};

export const SECTION_COLORS = {
  home: {
    primary: COLORS.home,
    light: '#EBF5FB',
    dark: '#2980B9',
  },
  stuff: {
    primary: COLORS.pools,
    light: '#E8F8F5',
    dark: '#1E8449',
  },
  food: {
    primary: COLORS.food,
    light: '#FDEDEC',
    dark: '#C0392B',
  },
  me: {
    primary: COLORS.profile,
    light: '#FEF5E7',
    dark: '#D68910',
  },
  host: {
    primary: COLORS.host,
    light: '#E8F6F3',
    dark: '#148F77',
  },
  community: {
    primary: COLORS.community,
    light: '#F5EEF8',
    dark: '#7D3C98',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,    // Minimum body text for readability
  lg: 18,
  xl: 22,
  xxl: 28,
  hero: 36,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Minimum touch target size for accessibility
export const TOUCH_TARGET = {
  min: 48,
  preferred: 56,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};
