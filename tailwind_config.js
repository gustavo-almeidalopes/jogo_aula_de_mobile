tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                heading: ['Space Grotesk', 'sans-serif'],
                sans: ['Outfit', 'sans-serif'],
            },
            colors: {
                game: {
                    dark: '#050505',
                    darker: '#000000',
                    primary: '#ff3366',
                    accent: '#00f0ff',
                    surface: '#111111',
                }
            },
            animation: {
                'spin-slow': 'spin 15s linear infinite',
                'blob': 'blob 10s infinite',
            },
            keyframes: {
                blob: {
                    '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                }
            }
        }
    }
}
