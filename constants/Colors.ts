const tintColorLight = "#E86F44"; // Coral Orange
const tintColorDark = "#5CB7A5"; // Ocean Teal

export default {
  light: {
    text: "#E86F44", // Coral Orange for text
    background: "#F8ECBC", // Sandy Beige for background
    tint: tintColorLight, // Coral Orange tint
    tabIconDefault: "#A2D1B1", // Minty Green for default icon
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#F8ECBC", // Sandy Beige for text in dark mode
    background: "#2C2C2C", // Dark gray background for contrast
    tint: tintColorDark, // Ocean Teal tint
    tabIconDefault: "#EEAB43", // Golden Yellow for default icon
    tabIconSelected: tintColorDark,
  },
};
