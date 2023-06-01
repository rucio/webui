module.exports = {
    content: {
        files: ["./src/**/*.{html,js,tsx,ts}"],
    },
    theme: {
        extend: {
            keyframes: {
                floatout: {
                    "0%": { opacity: "1", left: "0px", },
                    "80%": { opacity: "1", left: "0px", },
                    "100%": { opacity: "0", left: "100px", }
                },
                fadeout: {
                    "0%": { opacity: "1" },
                    "80%": { opacity: "1" },
                    "100%": { opacity: "0" }
                },
            },
            animation: {
                'slowspin': 'spin 2s linear infinite',
                'floatout': 'floatout 5s linear 1',
                'fadeout': 'fadeout 5s linear 1',
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
    ],
}