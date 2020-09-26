import getImage from "../mixins/getImage";
export default {
  methods: {
    getUserImage(google, googleImage) {
      return getImage.methods.getImage(
        localStorage.getItem("imgProfileID"),
        google,
        googleImage
      );
    }
  }
};
