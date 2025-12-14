/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                'neo-black': '#0a0a0a',
                'neo-dark': '#151515', // Gris muy oscuro para fondos secundarios
                'neo-white': '#e8e8e8', // Blanco más suave
                'neo-gray': '#404040', // Gris medio
                'neo-lime': '#7c9c4d', // Verde oliva apagado (antes lima neón)
                'neo-pink': '#c25d85', // Rosa marrón suave (antes fucsia)
                'neo-cyan': '#5a8a9a', // Teal apagado (antes cian)
                'neo-purple': '#6b4f7c', // Morado profundo (antes morado digital)
                'neo-gold': '#b8996f', // Dorado suave para acentos
            },
            boxShadow: {
                'neo': '5px 5px 0px 0px rgba(64,64,64,0.5)', // Sombra suave gris
                'neo-sm': '3px 3px 0px 0px rgba(64,64,64,0.5)',
                'neo-color': '8px 8px 0px 0px #6b4f7c', // Sombra morada suave
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
