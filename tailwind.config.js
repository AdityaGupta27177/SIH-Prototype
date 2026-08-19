module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          50: '#f2f6f3',
          100: '#e1ebe4',
          200: '#c5d8cd',
          600: '#2b533d',
          700: '#234432',
          800: '#1E3A2B',
          900: '#172E22',
          950: '#0F1E16',
        },
        umber: {
          50: '#f8f6f4',
          100: '#efece7',
          200: '#ded7ce',
          600: '#6d523c',
          700: '#533E2D',
          800: '#423224',
          900: '#32251b',
        },
        wheat: {
          50: '#fbf9f0',
          100: '#f5f0db',
          500: '#d4af37',
          600: '#b8860b',
          700: '#996e06',
          800: '#7a5704',
        },
        canvas: {
          50: '#FCFBF9',
          100: '#F6F4EE',
          200: '#EBE7DC',
          300: '#DED8C9',
          400: '#B0A894',
          600: '#5A5445',
          800: '#2F2B22',
        },
        ink: {
          50: '#f4f5f4',
          100: '#e4e6e4',
          300: '#9da39e',
          500: '#59615b',
          700: '#333b35',
          900: '#1F2421',
          950: '#141815',
        },
        crimson: {
          50: '#fdf2f2',
          600: '#c53030',
          700: '#9b2c2c',
          800: '#742a2a',
        }
      },
      fontFamily: {
        serif: ['Lora', 'Merriweather', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'doc': '0 1px 3px rgba(31, 36, 33, 0.05), 0 4px 14px rgba(30, 58, 43, 0.04)',
        'doc-lg': '0 4px 8px -2px rgba(31, 36, 33, 0.04), 0 12px 28px -4px rgba(30, 58, 43, 0.08)',
        'tactile': 'inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 3px rgba(31,36,33,0.06), 0 6px 18px rgba(30,58,43,0.05)',
      }
    },
  },
  plugins: [],
};
