module.exports = {
  // ... other config
  theme: {
    extend: {
      // ... other extensions
    },
  },
  plugins: [],
  variants: {
    extend: {},
  },
  layers: {
    utilities: {
      ".no-scrollbar::-webkit-scrollbar": {
        display: "none",
      },
      ".no-scrollbar": {
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
      },
    },
  },
};
