const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */
export const content = [
  // Or if using `src` directory:
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
  flowbite.content(),
];
export const theme = {
  extend: {
    colors: {
      background: "var(--background)",
      foreground: "var(--foreground)",
    },
  },
};
export const plugins = [
  require('flowbite/plugin'),
  flowbite.plugin(),
];
