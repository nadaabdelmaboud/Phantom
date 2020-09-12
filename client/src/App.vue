<template>
  <div @click="checkLists">
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
  },
  methods:{
    checkLists(event){
      console.log(event.target.id)
      if(event.target.id == "alertIcon")
        this.$store.commit("notifications/alterShow",true)
      else
        this.$store.commit("notifications/alterShow",false)
    }
  }
};
</script>

<style scoped></style>
