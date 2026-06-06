export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        tactical: {
          black: '#050505',
          cyan: '#00f2ff',
          danger: '#ff073a'
        }
      },
      boxShadow: {
        glass: '0 0 0 1px rgba(0,255,255,0.16), 0 20px 50px rgba(0,0,0,0.5)'
      }
    }
  },
  plugins: []
};
