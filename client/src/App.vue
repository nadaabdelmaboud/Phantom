<template>
  <div id="app">
    <router-view :key="newKey"></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data: function() {
    return {
      newKey: 0
    };
  },
  created() {
    this.$store.dispatch("user/getUserProfile");
  },
  watch: {
    $route() {
      this.newKey = (this.newKey + 1) % 4;
    }
  }
};
</script>

<style scoped></style>
