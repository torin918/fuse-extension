const { heroui } = require('@heroui/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
    darkMode: 'class',
    content: [
        './src/**/*.tsx',
        // make sure it's pointing to the ROOT node_module
        './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {},
    },
    plugins: [heroui()],
};
