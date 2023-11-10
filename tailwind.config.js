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
            animation: {
                'lentur': 'lentur 16s linear infinite'
            },
            keyframes: {
                lentur: {
                    '0%, 100%': {
                        borderRadius: '63% 37% 73% 27% / 37% 67% 33% 63%',
                        backgroundColor: '#52616B'
                    },
                    '25%': {
                        borderRadius: '26% 74% 49% 51% / 35% 53% 47% 65%',
                        backgroundColor: '#707E87'
                    },
                    '50%': {
                        borderRadius: '64% 36% 62% 38% / 55% 32% 68% 45%',
                        backgroundColor: '#7F8990'
                    },
                    '75%': {
                        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70% ',
                        backgroundColor: '#707E87',
                    },
                },
            }
        },
    },
    plugins: [],
}