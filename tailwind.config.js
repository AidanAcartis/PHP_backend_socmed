/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        socialBg:'#F7F5F8',
        socialBlue: '#218DFA',
        backg : "#060524",
        secondary: "#100F33",
        opacity: "#DDB1C7",
      },
    },
  },
  plugins: [],
};
