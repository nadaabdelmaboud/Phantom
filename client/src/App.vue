<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { initializeFirebase } from "../src/messaging/init";
export default {
  name: "App",
  data: function() {
    return {
      newKey: 0
    };
  },
  created() {
    this.$store.dispatch("user/getUserProfile");
    initializeFirebase();
    window.addEventListener("scroll", () => {
      console.log(document.body.clientHeight, "   ", window.scrollY);
      if (window.scrollY == window.scrollHeight) console.log("scroloo");
    });
  }
};
</script>

<style scoped></style>
