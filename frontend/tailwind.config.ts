import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dayline: {
          50: '#fff7fb',
          100: '#ffeaf4',
          200: '#ffcde4',
          300: '#f6acd0',
          400: '#ef8fbf',
          500: '#db5f9a',
        },
      },
    },
  },
  plugins: [],
};

export default config;
