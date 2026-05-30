// Block Share App v2.0 - Theme Constants
// Design system port from Claude Design prototype

export const COLORS = {
  // Surfaces
  background: '#FAF6F0',
  cream: '#F3EFE6',
  surface: '#FFFFFF',
  surface2: '#FBF8F2',
  white: '#FFFFFF',

  // Ink
  text: '#24231F',
  textSoft: '#6A6760',
  textLight: '#6A6760',
  textFaint: '#9A9384',

  // Lines
  border: '#EEE6D8',
  borderStrong: '#E2D8C6',

  // Brand
  primary: '#D35831',
  primaryDeep: '#B1451F',
  primaryWash: '#FFF0E2',
  accent: '#3E6B5C',
  accentDeep: '#2F5246',
  accentWash: '#E6EEE9',

  // Section
  home: '#3E6B5C',
  stuff: '#D35831',
  food: '#B23A48',
  me: '#C77D33',
  community: '#3D6A8A',

  // Status
  success: '#3E6B5C',
  warning: '#C77D33',
  error: '#B23A48',
  available: '#3E6B5C',
  borrowed: '#B1451F',
};

export const SECTION_COLORS = {
  home:      { primary: '#3E6B5C', light: '#E6EEE9', dark: '#2F5246' },
  stuff:     { primary: '#D35831', light: '#FFF0E2', dark: '#B1451F' },
  food:      { primary: '#B23A48', light: '#FDEAEC', dark: '#8B2D38' },
  me:        { primary: '#C77D33', light: '#FEF3E7', dark: '#A06425' },
  host:      { primary: '#3E6B5C', light: '#E6EEE9', dark: '#2F5246' },
  community: { primary: '#3D6A8A', light: '#E8EFF5', dark: '#2D506A' },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 22,
  xxl: 26,
  hero: 44,
};

export const BORDER_RADIUS = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  full: 9999,
};

export const TOUCH_TARGET = {
  min: 44,
  preferred: 56,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#28180A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#28180A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },
  lg: {
    shadowColor: '#28180A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
};
