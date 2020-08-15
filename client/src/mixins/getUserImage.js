import getImage from "../mixins/getImage";
export default {
  methods: {
    getUserImage() {
      return getImage.methods.getImage(localStorage.getItem("imgProfileID"));
    }
  }
};
