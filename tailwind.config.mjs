/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                background: 'var(--bg-primary)',
                foreground: 'var(--text-primary)',
                card: 'var(--bg-secondary)',
                'card-foreground': 'var(--text-primary)',
                muted: 'var(--accent)',
                'muted-foreground': 'var(--text-secondary)',
                border: 'var(--border)',
                ring: 'var(--violet)',
                ink: 'rgb(var(--black-rgb) / <alpha-value>)',
                paper: 'rgb(var(--white-rgb) / <alpha-value>)',
            },
        },
    },
    plugins: [],
}
