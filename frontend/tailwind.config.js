export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    plugins: [require("daisyui")],
    daisyui: {
        themes: ["halloween", "cupcake", "dark", "dracula", "cyberpunk"], // Only cupcake, no dark theme fallback
    },
};