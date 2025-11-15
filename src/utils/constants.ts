// 孟菲斯风格颜色配置
export const MEMPHIS_COLORS = {
  // 主色调
  primary: {
    50: '#fff0f5',
    100: '#ffe0eb',
    200: '#ffc1d6',
    300: '#ff9bc1',
    400: '#ff6da8',
    500: '#ff3d8a',
    600: '#ff1a7a',
    700: '#e6006b',
    800: '#c7005c',
    900: '#a5004d',
  },
  // 辅助色
  secondary: {
    yellow: '#FFD93D',
    pink: '#FF6B9D',
    blue: '#4ECDC4',
    purple: '#A8E6CF',
    orange: '#FFA726',
    green: '#66BB6A',
  },
  // 中性色
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  // 背景色
  background: {
    light: '#FFF5F5',
    dark: '#2D1B69',
  },
} as const;

// 孟菲斯风格阴影
export const MEMPHIS_SHADOWS = {
  sm: '2px 2px 0px rgba(0, 0, 0, 0.1)',
  md: '4px 4px 0px rgba(0, 0, 0, 0.1)',
  lg: '6px 6px 0px rgba(0, 0, 0, 0.1)',
  xl: '8px 8px 0px rgba(0, 0, 0, 0.1)',
} as const;

// 孟菲斯风格边框
export const MEMPHIS_BORDERS = {
  solid: '3px solid',
  dashed: '3px dashed',
  dotted: '3px dotted',
  double: '6px double',
} as const;