<template>
  <div>
    <div class="content" v-if="this.$route.query.type == 'changeEmail'">
      <h3>Current Email Confirmed</h3>
      <h3>Please Check your new email inbox</h3>
    </div>
    <div class="content" v-else>
      <h3>Your email changed succesfully</h3>
      <router-link to="/">Enjoy Phantom Now</router-link>
    </div>
  </div>
</template>

<script>
export default {
  created: function() {
    console.log(this.$route.query.token);
    this.$store.dispatch("user/confrimEmailUpdate", {
      token: this.$route.query.token,
      type: this.$route.query.type
    });
  }
};
</script>

<style lang="scss" scoped>
.content {
  margin-top: 30vh;
  text-align: center;
}

h3 {
  font-weight: bold;
}

a {
  background-color: #3e6990;
  color: #f1f1f1;
  text-decoration: none;
  padding: 10px 30px;
  border-radius: 20px;
  display: block;
  max-width: 250px;
  margin: 20px auto;
}

a:hover {
  color: #f1f1f1;
  text-decoration: none;
  transform: scale(1.05, 1.05);
}
</style>
