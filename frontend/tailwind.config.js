/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        typography: (theme) => ({
              white: {
                css: {
                  color: 'white',
                  h1: { color: 'white' },
                  h2: { color: 'white' },
                  h3: { color: 'white' },
                  li: { color: 'white' },
                  '--tw-prose-body': theme('colors.white'),
                  '--tw-prose-headings': theme('colors.white'),
                  '--tw-prose-lead': theme('colors.white'),
                  '--tw-prose-links': theme('colors.white'),
                  '--tw-prose-bold': theme('colors.white'),
                  '--tw-prose-counters': theme('colors.white'),
                  '--tw-prose-bullets': theme('colors.white'),
                  '--tw-prose-hr': theme('colors.white'),
                  '--tw-prose-quotes': theme('colors.white'),
                  '--tw-prose-quote-borders': theme('colors.white'),
                  '--tw-prose-captions': theme('colors.white'),
                  '--tw-prose-code': theme('colors.white'),
                  '--tw-prose-pre-code': theme('colors.white'),
                  '--tw-prose-pre-bg': theme('colors.black'),
                  '--tw-prose-th-borders': theme('colors.white'),
                  '--tw-prose-td-borders': theme('colors.white'),
                },
              },
            }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
