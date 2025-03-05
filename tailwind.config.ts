import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f8b700',
        'primary-hover': '#c69200',
        'primary-focus': 'rgba(248, 183, 0, 0.25)',
        'background-color': '#15171e',
        'card-background-color': '#1f2937',
        'card-sectionning-background-color': '#252e3d',
        'modal-overlay-background-color': 'rgba(0, 0, 0, 0.8)',
        color: '#ebdec2',
        'muted-color': '#a89368',
        'mark-background-color': '#a89368',
        'form-element-background-color': '#252e3d',
        'form-element-border-color': '#3d434f',
        'form-element-color': '#ebdec2',
        'form-element-placeholder-color': '#8e8e8e',
        'form-element-active-background-color': '#252e3d',
        'form-element-active-border-color': '#f8b700',
      },
    },
  },
  plugins: [],
} satisfies Config;
