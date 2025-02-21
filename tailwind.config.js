/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./**/*.html", "./**/*.js"],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                "ibm-regular": ["IBM-Regular", "sans-serif"],
                montserrat: ["Montserrat", "sans-serif"],
                tinos: ["Tinos", "sans-serif"],
            },
            maxWidth: {
                "container-main": "1380px",
                "container-pictures": "1300px"
            },
        },
    },
    plugins: [],
};
