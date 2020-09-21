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
          this.$store.commit("user/setKey",0)
          console.log("r",this.$route.path)
          if(this.$route.path !="/")
            this.$router.push("/");
        })
        .catch(err => console.log(err));
    }
  }
};
