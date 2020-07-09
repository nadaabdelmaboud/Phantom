<template>
  <div class="content" style="margin: 10%">
    <center>
      <i class="fa fa-envelope-o fa-5x" aria-hidden="true"></i>
      <h1>Thanks for confirmation</h1>
      <br />
      <h2>Enjoy Phantom...</h2>
      <br />
      <button class="btn" @click="goToHome">Start Journey</button>
    </center>
  </div>
</template>

<script>
export default {
  created() {
    console.log(this.$route.query.token);
    this.$store.dispatch("user/confirmEmail", this.$route.query.token);
  },
  methods: {
    goToHome: function() {
      this.$store.commit("popUpsState/toggleWelcomeState");
      this.$router.push("/");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
h1,
h2 {
  font-weight: bold;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}

.btn {
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 4px;
  padding-bottom: 4px;
  background-color: $darkBlue;
  border-radius: 20px;
  border: none;
  color: $offWhite;
  text-decoration: none;
  font-size: 18px;
}
i {
  color: $darkBlue;
}
</style>
