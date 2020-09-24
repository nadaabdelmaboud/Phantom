<template>
  <div>
    <div class="flexWrap">
      <div class="masonryGrid">
        <HomeCard
          v-for="pin in pins"
          :key="pin._id"
          :cardImage="pin.imageId"
          :postPageId="pin._id"
          class="masonryGridItem"
        />
      </div>
    </div>
    <div>
      <Loading :loading="true" />
    </div>
  </div>
</template>

<script>
import HomeCard from "../HomeCard";
import Loading from "../GeneralComponents/Loading";
export default {
  components: {
    HomeCard,
    Loading
  },
  computed: {
    pins() {
      return this.$store.state.search.pins;
    }
  },
  mounted: function() {
    this.$store.dispatch("search/searchPins", {
      name: this.$route.params.name
    });
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/MasonryGrid";
</style>
