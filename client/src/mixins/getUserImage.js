import getImage from "../mixins/getImage";
export default {
  methods: {
    getUserImage(google = false, googleImage = "") {
      return getImage.methods.getImage(
        localStorage.getItem("imgProfileID"),
        google,
        googleImage
      );
    }
  }
};
