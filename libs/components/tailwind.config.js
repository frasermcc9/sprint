// apps/app1/tailwind.config.js
const { createGlobPatternsForDependencies } = require("@nrwl/next/tailwind");
const { join } = require("path");

module.exports = {
  content: [
    join(__dirname, "pages/**/*.{js,ts,jsx,tsx}"),
    "libs/components/**/*.{js,ts,jsx,tsx}",
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      fontFamily: {
        overpass: ["Overpass", "sans-serif"],
        palanquin: ["Palanquin Dark", "sans-serif"],
        round: ['"M PLUS Rounded 1c"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
