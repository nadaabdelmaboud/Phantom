import axios from "axios"

export default {
  methods: {
    removeUserData() {
      if (localStorage.getItem("userToken")) {
        localStorage.removeItem("userToken");
        localStorage.removeItem("imgProfileID");
      }
      axios.put("log-out")
      .then(()=>{
        delete axios.defaults.headers.common["Authorization"];
        this.$router.push("/");
      })
      .catch(err=>console.log(err))
    }
  }
};
