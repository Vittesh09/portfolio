/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/v2/**/*.{js,ts,jsx,tsx}',
    './src/components/v2/**/*.{js,ts,jsx,tsx}',
    './src/config/v2/**/*.{js,ts,jsx,tsx}'
  ],
  important: '.v2-root',
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--v2-bg-primary)',
        'bg-surface': 'var(--v2-bg-surface)',
        'bg-muted': 'var(--v2-bg-muted)',
        'text-primary': 'var(--v2-text-primary)',
        'text-secondary': 'var(--v2-text-secondary)',
        'text-muted': 'var(--v2-text-muted)',
        'border-subtle': 'var(--v2-border-subtle)',
        'accent-pop': 'var(--v2-accent-pop)',
        'accent-blue': 'var(--v2-accent-blue)'
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-instrument)', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace']
      },
      letterSpacing: {
        tighter: '-0.04em',
        tightest: '-0.06em'
      }
    }
  },
  plugins: []
};
