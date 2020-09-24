<template>
  <div class="content">
    <ring-loader :loading="loading" color="#da94a8"></ring-loader>
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
  margin-left: 49vw;
}
</style>
