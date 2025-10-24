<<<<<<< HEAD
/** @type {import('tailwindcss').Config} */
import tailwindcss from '@tailwindcss/vite'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#0f172a",
        border: "#e5e7eb",
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a"
        }
      },
    },
  },
  plugins: [
    tailwindcss(),
  ],
}
=======
import { defineConfig } from 'vite' import react from '@vitejs/plugin-react' // https://vite.dev/config/ export default defineConfig({ plugins: [ react({ babel: { plugins: [['babel-plugin-react-compiler']], }, }), ], })
>>>>>>> 21c107ffda62c0353e87f7b9d0fad26edb11c6ab
