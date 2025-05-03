/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      keyframes: {
        "gradient-border": {
          "0%, 100%": { transform: "translateX(-10%) translateY(-10%)" },
          "50%": { transform: "translateX(10%) translateY(10%)" },
        },
        "gradient-1": {
          "0%": { opacity: 0 },
          "25%": { opacity: 1 },
          "75%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        "gradient-2": {
          "0%": { opacity: 0 },
          "25%": { opacity: 0 },
          "50%": { opacity: 1 },
          "75%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        "gradient-3": {
          "0%": { opacity: 0 },
          "25%": { opacity: 0 },
          "50%": { opacity: 0 },
          "75%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        "gradient-4": {
          "0%": { opacity: 0 },
          "33%": { opacity: 0 },
          "66%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        "gradient-border": "gradient-border 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} 