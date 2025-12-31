module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
    colors: {
      background: "var(--background)",
      foreground: "var(--foreground)",
    },
      fontFamily: {
        mono: ["SpaceMono"],
        'mono-bold': ["SpaceMono-Bold"],
      },

    },
  },
  plugins: [],
};
