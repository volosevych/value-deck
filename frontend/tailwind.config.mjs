/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "15px",
    },

    navContainer: {
      innerWidth: '1728px',
      center: true,
    },
    extend: {
      animation: {
        'fade-out': 'fadeOut 0.5s ease-in-out',
      },
      keyframes: {
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      textShdaow: {
        DEFAULT: '0 1px 3px rgba(0, 0, 0, 0.8)',
        strong: '0 0 5px rgba(0, 0, 0, 0.9)',
      },
      colors: {
        brown: "#816F68",
        lightBrown :"#8D7471",
        pink: "#9F838C",
        quartz: "#BAABBD",
        blue: "#C9C9EE",
        gray: "#3C3D37",
        black: "#181C14",
        green: "#697565",
        white: "#ECDFCC"
      },
    },
  },
  plugins: [
    require('tailwindcss-textshadow'),
  ],
};
