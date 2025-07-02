module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // your source files
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#1F2D3D',
          surface: '#3B4758',
          deep: '#222831',
        },
        accent: {
          DEFAULT: '#00ADB5',
          hover: '#00C4CC',
        },
        text: {
          primary: '#FFFFFF',
          secondary: 'rgba(255,255,255,0.7)',
          placeholder: 'rgba(255,255,255,0.5)',
        },
        semantic: {
          success: '#22C55E',
          danger: '#EF4444',
          info: '#3B82F6',
        },
      },
    },
  },
  plugins: [],
};
