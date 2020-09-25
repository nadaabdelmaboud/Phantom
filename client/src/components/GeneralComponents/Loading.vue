<template>
  <div class="content">
    <div class="wrapper">
      <ring-loader :loading="loading" color="#da94a8"></ring-loader>
    </div>
  </div>
</template>

<script>
import RingLoader from "vue-spinner/src/RingLoader.vue";
export default {
  components: {
    RingLoader
  },
  props: {
    loading: Boolean
  }
};
</script>

<style lang="scss" scoped>
.content {
  padding-bottom: 40px;
}
.wrapper {
  width: 60px;
  margin: auto;
}
</style>
