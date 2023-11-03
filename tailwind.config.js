/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./public/**/*.{html,js}"],
    theme: {
        container: {
            center: true,
            padding: '18px',
        },
        extend: {
            colors: {
                primary: '#52616B',
                secondary: '#F0F5F9',
                third: '#C9D6DF',
                forth: '#1E2022',
                dark: '#09090b'
            },
            screens: {
                '2xl': '1320px'
            },
            fontFamily: {
                'sans': ['Roboto', 'Helvetica', 'Arial', 'sans'],
                'serif': ['Georgia', 'Cambria', 'serif'],
                'mono': ['Monaco', 'Courier New', 'monospace'],
            },
        },
    },
    plugins: [],
}