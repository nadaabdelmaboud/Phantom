module.exports = {
  // set your styleguidist configuration here
  title: "Symphonia Documentation",
  sections: [
    {
      name: "Views",
      description: "Documentation for the views",
      components: ["src/views/**/*.vue"]
    },

    {
      name: "Components",
      description: "Documentation for the components",
      components: ["src/components/**/*.vue"]
    },

    {
      name: "Helpers",
      description: "Documentation for global helper functions",
      components: ["src/mixins/**/*.js"]
    }
  ],
  theme: {
    fontFamily: {
      base: '"Lucida Sans Unicode", "Lucida Grande", sans-serif'
    },
    sidebarWidth: 250,
    fontSize: {
      base: 16,
      text: 14,
      small: 14,
      h4: 20,
      h5: 18,
      h6: 18
    },
    space: [4, 8, 16, 18, 24, 24, 24]
  },
  usageMode: "expand",
  tocMode: "collapse",
  sortProps: props => props,
  template: {
    favicon: "public/favicon.png"
  }
};
