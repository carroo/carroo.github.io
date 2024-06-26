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
                'primary': ["'Black Ops One'", 'system-ui'],
                'secondary': ["'Exo 2'", 'sans']
            },
            animation: {
                'lentur': 'lentur 12s linear infinite',
                'anigra': 'anigra 1s ease-out infinite',
                'fadeOutUp': 'fadeOutUp 1s forwards',
                'fadeInUp': 'fadeInUp 1s forwards'
            },
            keyframes: {
                anigra: {
                    '0%': {
                        'background-image': 'linear-gradient(45deg, #b0b0b0, #909090, #707070, #505050, #303030, #101010, #303030, #505050, #707070, #909090)'
                    },
                    '10%': {
                        'background-image': 'linear-gradient(45deg, #909090, #707070, #505050, #303030, #101010, #303030, #505050, #707070, #909090, #b0b0b0)'
                    },
                    '20%': {
                        'background-image': 'linear-gradient(45deg, #707070, #505050, #303030, #101010, #303030, #505050, #707070, #909090, #b0b0b0, #909090)'
                    },
                    '30%': {
                        'background-image': 'linear-gradient(45deg, #505050, #303030, #101010, #303030, #505050, #707070, #909090, #b0b0b0, #909090, #707070)'
                    },
                    '40%': {
                        'background-image': 'linear-gradient(45deg, #303030, #101010, #303030, #505050, #707070, #909090, #b0b0b0, #909090, #707070, #505050)'
                    },
                    '50%': {
                        'background-image': 'linear-gradient(45deg, #101010, #303030, #505050, #707070, #909090, #b0b0b0, #909090, #707070, #505050, #303030)'
                    },
                    '60%': {
                        'background-image': 'linear-gradient(45deg, #303030, #505050, #707070, #909090, #b0b0b0, #909090, #707070, #505050, #303030, #101010)'
                    },
                    '70%': {
                        'background-image': 'linear-gradient(45deg, #505050, #707070, #909090, #b0b0b0, #909090, #707070, #505050, #303030, #101010, #303030)'
                    },
                    '80%': {
                        'background-image': 'linear-gradient(45deg, #707070, #909090, #b0b0b0, #909090, #707070, #505050, #303030, #101010, #303030, #505050)'
                    },
                    '90%': {
                        'background-image': 'linear-gradient(45deg, #909090, #b0b0b0, #909090, #707070, #505050, #303030, #101010, #303030, #505050, #707070)'
                    },
                    '100%': {
                        'background-image': 'linear-gradient(45deg, #b0b0b0, #909090, #707070, #505050, #303030, #101010, #303030, #505050, #707070, #909090)'
                    },
                },
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
                fadeOutUp: {
                    '0%': {
                        opacity: '1',
                    },
                    '90%': {
                        opacity: '1',
                    },
                    '100%': {
                        opacity: '0',
                        transform: 'translateY(-100%)',
                    },
                },
                fadeInUp: {
                    '0%': {
                        opacity: '1',
                        transform: 'translateY(100%)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                }
                
            }
        },
    },
    plugins: [],
}