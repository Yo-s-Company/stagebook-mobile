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
      background: {
        DEFAULT: "#E5E4E2",
        dark: "#292929",
      },
      foreground: {
        DEFAULT: "#000000",
        dark: "#ffffff",
      },
      card: {
        DEFAULT: "#f4f4f5",
        dark: "#18181b",
      },
    },
    fontFamily: {
        mono: [Platform.OS === 'ios' ? "Courier" : "monospace"],
      },
  },
},

  plugins: [],
};
