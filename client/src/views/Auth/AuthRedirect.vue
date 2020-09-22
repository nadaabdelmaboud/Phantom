<template>
  <div class="content">
    <h1>Authorized Sucssesfully</h1>
    <h1>Redirecting ...</h1>
  </div>
</template>

<script>
export default {
  created: function() {
    localStorage.setItem("userToken", this.$route.query.token);
    console.log(localStorage.getItem("userToken"));
    if (this.$route.query.type != "login")
      this.$store.commit("popUpsState/toggleWelcomeState");
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
