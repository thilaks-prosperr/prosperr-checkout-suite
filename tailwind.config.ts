import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
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
          light: "hsl(var(--primary-light))",
          lighter: "hsl(var(--primary-lighter))",
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
        sales: {
          bg: "hsl(var(--sales-bg))",
          surface: "hsl(var(--sales-surface))",
          "surface-hover": "hsl(var(--sales-surface-hover))",
          border: "hsl(var(--sales-border))",
          foreground: "hsl(var(--sales-foreground))",
          muted: "hsl(var(--sales-muted))",
          accent: "hsl(var(--sales-accent))",
          "accent-foreground": "hsl(var(--sales-accent-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        prosperr: {
          green: {
            900: "hsl(var(--green-900))",
            700: "hsl(var(--green-700))",
            500: "hsl(var(--green-500))",
            300: "hsl(var(--green-300))",
            100: "hsl(var(--green-100))",
            50: "hsl(var(--green-50))",
          },
          navy: {
            950: "hsl(var(--navy-950))",
            900: "hsl(var(--navy-900))",
            800: "hsl(var(--navy-800))",
            700: "hsl(var(--navy-700))",
            600: "hsl(var(--navy-600))",
            500: "hsl(var(--navy-500))",
            400: "hsl(var(--navy-400))",
          },
          blue: {
            800: "hsl(var(--blue-800))",
            700: "hsl(var(--blue-700))",
            600: "hsl(var(--blue-600))",
            500: "hsl(var(--blue-500))",
            200: "hsl(var(--blue-200))",
            100: "hsl(var(--blue-100))",
            50: "hsl(var(--blue-50))",
          },
          gray: {
            800: "hsl(var(--gray-800))",
            700: "hsl(var(--gray-700))",
            500: "hsl(var(--gray-500))",
            400: "hsl(var(--gray-400))",
            300: "hsl(var(--gray-300))",
            200: "hsl(var(--gray-200))",
            100: "hsl(var(--gray-100))",
          },
          gold: {
            DEFAULT: "hsl(var(--gold))",
            light: "hsl(var(--gold-light))",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
