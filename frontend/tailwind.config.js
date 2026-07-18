/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-primary': '#29292F',
        'light-blue': '#BAC3FF',
        'dark-background': '#121318',
        'slate-gray': '#434659',
        'deep-blue': '#222C61'
      },
      fontFamily: {
        'sans': ['Raleway', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'custom': '0 4px 6px -1px rgba(186, 195, 255, 0.1), 0 2px 4px -1px rgba(186, 195, 255, 0.06)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #29292F, #121318)',
      },
      borderRadius: {
        'xl': '1rem',
      },
      transitionProperty: {
        'colors-all': 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow',
      }
    },
  },
  plugins: [],
}