<template>
  <div class="content">
    <h1>Authorized Sucssesfully</h1>
    <h1>Redirecting ...</h1>
  </div>
</template>

<script>
import { initializeFirebase } from "../../messaging/init";
export default {
  created: async function() {
    localStorage.setItem("userToken", this.$route.query.token);
    console.log(localStorage.getItem("userToken"));
    if (this.$route.query.type != "login")
      this.$store.commit("popUpsState/toggleWelcomeState");
    await this.$store.dispatch("user/getUserProfile");
    initializeFirebase();
    this.$router.push("/");
  }
};
</script>

<style lang="scss" scoped>
.content {
  margin: 20vh auto;
  text-align: center;
}
</style>
