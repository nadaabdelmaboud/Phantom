import axios from "axios";

export default {
  methods: {
    removeUserData() {
      if (localStorage.getItem("userToken")) {
        localStorage.removeItem("userToken");
        localStorage.removeItem("imgProfileID");
      }
      axios
        .put("log-out")
        .then(() => {
          delete axios.defaults.headers.common["Authorization"];
          if (this.$route.path != "/") this.$router.push("/");
          location.reload();
          this.$store.commit("user/setKey", 0);
          this.$store.commit("homeCards/resetHome");
        })
        .catch(err => console.log(err));
    }
  }
};
