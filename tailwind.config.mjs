/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                'neo-black': '#0a0a0a',
                'neo-white': '#fcfcfc',
                'neo-lime': '#ccff00', // Lima eléctrico
                'neo-pink': '#ff0099', // Fucsia neón
                'neo-cyan': '#00ffff', // Cian puro
                'neo-purple': '#bc13fe', // Morado digital
            },
            boxShadow: {
                'neo': '5px 5px 0px 0px rgba(255,255,255,1)', // Sombra dura blanca
                'neo-sm': '3px 3px 0px 0px rgba(255,255,255,1)',
                'neo-color': '8px 8px 0px 0px #bc13fe', // Sombra dura morada
            },
            animation: {
                'float': 'float 4s ease-in-out infinite',
                'shake': 'shake 0.5s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-15px)' },
                },
                shake: {
                    '0%, 100%': { transform: 'rotate(-1deg)' },
                    '50%': { transform: 'rotate(1deg)' },
                }
            },
        },
    },
    plugins: [],
}
