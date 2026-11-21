module.exports = {
  content: [
    './index.html',
    './privacy.html',
    './terms.html',
    './newsletter-thanks.html',
    './_templates/**/*.html',
    './insights/**/*.html',
    './legal/**/*.html',
    './design-system/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        navy: 'var(--ax-navy)',
        pink: 'var(--ax-pink)',
        cyan: 'var(--ax-cyan)',
        amber: 'var(--ax-amber)',
        'amber-text': 'var(--ax-amber-text)',
        purple: 'var(--ax-purple)',
        green: 'var(--ax-green)',
        blue: 'var(--ax-blue)',
        'ax-white': 'var(--ax-white)',
        'paper': 'var(--ax-paper)',
        'paper-deep': 'var(--ax-paper-deep)',
      },
      fontFamily: {
        display: ['Figtree', 'system-ui', 'sans-serif'],
        body: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
