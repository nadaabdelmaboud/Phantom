export default {
  methods: {
    getUserToken() {
      return localStorage.getItem("userToken");
    }
  }
};
