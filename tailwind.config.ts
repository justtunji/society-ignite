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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
    extend: {
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'display': ['Playfair Display', 'serif'],
      },
      colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				purple: {
					DEFAULT: 'hsl(var(--purple))',
					foreground: 'hsl(var(--purple-foreground))',
					50: 'hsl(270 60% 95%)',
					100: 'hsl(270 60% 85%)',
					200: 'hsl(270 60% 75%)',
					600: 'hsl(270 60% 55%)',
					700: 'hsl(270 60% 45%)',
				},
				teal: {
					DEFAULT: 'hsl(var(--teal))',
					foreground: 'hsl(var(--teal-foreground))',
					50: 'hsl(180 70% 95%)',
					100: 'hsl(180 70% 85%)',
					200: 'hsl(180 70% 75%)',
					600: 'hsl(180 70% 45%)',
					700: 'hsl(180 70% 35%)',
				},
				coral: {
					DEFAULT: 'hsl(var(--coral))',
					foreground: 'hsl(var(--coral-foreground))',
					50: 'hsl(15 85% 95%)',
					100: 'hsl(15 85% 85%)',
					200: 'hsl(15 85% 75%)',
					600: 'hsl(15 85% 60%)',
					700: 'hsl(15 85% 50%)',
				},
				indigo: {
					DEFAULT: 'hsl(var(--indigo))',
					foreground: 'hsl(var(--indigo-foreground))',
					50: 'hsl(240 55% 95%)',
					100: 'hsl(240 55% 85%)',
					200: 'hsl(240 55% 75%)',
					600: 'hsl(240 55% 60%)',
					700: 'hsl(240 55% 50%)',
				},
				emerald: {
					DEFAULT: 'hsl(var(--emerald))',
					foreground: 'hsl(var(--emerald-foreground))',
					50: 'hsl(155 65% 95%)',
					100: 'hsl(155 65% 85%)',
					200: 'hsl(155 65% 75%)',
					600: 'hsl(155 65% 45%)',
					700: 'hsl(155 65% 35%)',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-rtl': 'slide-rtl 30s linear infinite',
				'bounce-soft': 'bounce 2s infinite',
				'pulse-slow': 'pulse 3s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
