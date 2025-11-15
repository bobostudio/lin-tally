/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        memphis: {
          // 主色调 - 简洁黑白主题
          primary: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#e5e5e5',
            300: '#d4d4d4',
            400: '#a3a3a3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#000000',
          },
          // 简洁强调色
          accent: {
            cyan: '#0891b2',
            magenta: '#be185d',
            green: '#059669',
            orange: '#ea580c',
            blue: '#2563eb',
            purple: '#7c3aed',
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
            light: '#ffffff',
            dark: '#0a0a0a',
            card: '#1a1a1a',
            surface: '#111111',
          },
          // 文本色
          text: {
            primary: '#ffffff',
            secondary: '#a3a3a3',
            muted: '#737373',
            dark: '#000000',
          },
        },
      },
      boxShadow: {
        'memphis-sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'memphis-md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'memphis-lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'memphis-xl': '0 20px 25px rgba(0, 0, 0, 0.1)',
      },
      borderWidth: {
        memphis: '1px',
      },
      borderRadius: {
        memphis: '1rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fredoka One', 'cursive'],
      },
      animation: {
        'memphis-bounce': 'memphis-bounce 0.6s ease-in-out',
        'memphis-pulse': 'memphis-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'memphis-bounce': {
          '0%, 100%': {
            transform: 'translateY(-5px)',
          },
          '50%': {
            transform: 'translateY(0)',
          },
        },
        'memphis-pulse': {
          '0%, 100%': {
            opacity: 1,
          },
          '50%': {
            opacity: 0.8,
          },
        },
      },
    },
  },
  plugins: [],
}
