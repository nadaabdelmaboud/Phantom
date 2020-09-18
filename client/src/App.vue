<template>
  <div @click="checkLists">
    <router-view></router-view>
  </div>
</template>

<script>
import { initializeFirebase } from "../src/messaging/init";
import axios from "axios";
export default {
  name: "App",
  data: function() {},
  created() {
    let token = localStorage.getItem("userToken");
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      this.$store.dispatch("user/getUserProfile");
    }
    initializeFirebase();
    window.addEventListener("scroll", () => {
      console.log(document.body.scrollHeight, "   ", window.scrollY, " ");
      console.log(
        window.innerHeight + window.scrollY,
        "   ",
        document.body.offsetHeight
      );
      if (
        Math.abs(
          window.innerHeight + window.scrollY - document.body.offsetHeight
        ) <= 1
      )
        console.log("scroloo");
    });
  },
  methods: {
    checkLists(event) {
      console.log(event.target.id);
      if (event.target.id == "alertIcon")
        this.$store.commit("notifications/alterShow", true);
      else this.$store.commit("notifications/alterShow", false);
    }
  }
};
</script>

<style scoped></style>
