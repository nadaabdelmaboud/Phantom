export default {
  methods: {
    removeUserData() {
      if (localStorage.getItem("userToken")) {
        localStorage.removeItem("userToken");
        localStorage.removeItem("imgProfileID");
      }
    }
  }
};
