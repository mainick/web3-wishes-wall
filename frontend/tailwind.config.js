module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')],
  // daisyUI config (optional)
  daisyui: {
    styled: true,
    themes: [
      'emerald', // first one will be the default theme
      'forest'
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: ''
  }
}
