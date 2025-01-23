import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
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
      colors: {
        siso: {
          bg: {
            DEFAULT: "#121212",
            light: "#ffffff",
          },
          "bg-alt": {
            DEFAULT: "#1A1A1A",
            light: "#f8f9fa",
          },
          red: "#FF5722",
          orange: "#FFA726",
          text: {
            DEFAULT: "#E0E0E0",
            light: "#2D3748",
          },
          "text-bold": {
            DEFAULT: "#FFFFFF",
            light: "#1A202C",
          },
          "text-muted": {
            DEFAULT: "#9E9E9E",
            light: "#718096",
          },
          border: {
            DEFAULT: "#2A2A2A",
            light: "#E2E8F0",
          },
          "border-hover": {
            DEFAULT: "#3A3A3A",
            light: "#CBD5E0",
          },
        },
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
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 15px rgba(255, 87, 34, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 25px rgba(255, 167, 38, 0.5)",
          },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float-slow": {
          "0%, 100%": {
            transform: "translate(0, 0)",
          },
          "50%": {
            transform: "translate(40px, 20px)",
          },
        },
        "float-slower": {
          "0%, 100%": {
            transform: "translate(0, 0)",
          },
          "50%": {
            transform: "translate(-40px, -20px)",
          },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" }
        },
        ping: {
          "75%, 100%": {
            transform: "scale(2)",
            opacity: "0"
          }
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0)"
          },
          "50%": {
            transform: "translateY(-10px)"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        glow: "glow 3s ease-in-out infinite",
        fadeIn: "fadeIn 0.5s ease-out forwards",
        "float-slow": "float-slow 20s ease-in-out infinite",
        "float-slower": "float-slower 25s ease-in-out infinite",
        "slide-in-right": "slide-in-right 0.3s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        ping: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        float: "float 3s ease-in-out infinite"
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#E0E0E0',
            h1: {
              color: '#FFFFFF',
            },
            h2: {
              color: '#FFFFFF',
            },
            h3: {
              color: '#FFFFFF',
            },
            strong: {
              color: '#FFFFFF',
            },
            a: {
              color: '#FF5722',
              '&:hover': {
                color: '#FFA726',
              },
            },
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;