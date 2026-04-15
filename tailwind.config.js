/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "jsd-orange": "#FF9900",
        "jsd-blue": "#FFB43B",
        "jsd-blue-dark": "#7A3B00",
        "jsd-white": "#FFFFFF",
        "jsd-light": "#F5F5F5",
        "jsd-black": "#111111"
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Manrope", "sans-serif"]
      },
      boxShadow: {
        glow: "0 24px 80px -32px rgba(255, 153, 0, 0.45)",
        panel: "0 18px 48px -24px rgba(122, 59, 0, 0.24)"
      },
      backgroundImage: {
        "grid-light":
          "linear-gradient(rgba(255,153,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,153,0,0.08) 1px, transparent 1px)",
        "grid-dark":
          "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};
