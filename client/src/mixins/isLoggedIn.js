export default {
  methods: {
    isLoggedIn() {
      return localStorage.getItem("userToken") ? true : false;
    }
  }
};
