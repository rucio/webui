module.exports = {
    content: ["./src/**/*.{html,js,tsx,ts}"],
    theme: {
        extend: {
            keyframes: {
                floatout: {
                    "0%": { opacity: "1", left: "0px", },
                    "80%": { opacity: "1", left: "0px",},
                    "100%": { opacity: "0", left: "100px", }
                },
            },
            animation: {
                'slowspin': 'spin 2s linear infinite',
                'floatout': 'floatout 5s linear 1',
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
    ],
}