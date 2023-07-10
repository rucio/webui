module.exports = {
    content: {
        files: ["./src/**/*.{html,js,tsx,ts}"],
        extract: {
            columnMetaStyle: (content) => {
                return content.match(/(?<=meta([:\s{]*)style:\s")[a-zA-Z\-\[\]0-9:\s]*(?=")/)
            },
            reactModalStyle: (content) => {
                return content.match(/(?<=overlayClassName=")[a-zA-Z\-\[\]0-9:\s]*(?=")/)
            },
        }
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