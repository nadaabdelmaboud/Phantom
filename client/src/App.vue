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
      if (
        Math.abs(
          window.innerHeight + window.scrollY - document.body.offsetHeight
        ) <= 1
      ) {
        if (this.$route.path.includes("/More")) {
          console.log("scroloo");
          let boardId = this.$route.params.boardId;
          this.$store.dispatch("boards/moreLike", {
          boardId: boardId,
          generate: false,
         });
        }
      }
    });
  },
  methods: {
    checkLists(event) {
      console.log(event.target.id);
      if (event.target.id == "alertIcon")
        this.$store.commit("notifications/alterShow", true);
      else this.$store.commit("notifications/alterShow", false);
    },
  },
};
</script>

<style scoped></style>
