<template>
  <div>
    <div class="flexWrap" v-if="pins.length">
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
    <div v-if="!loading && !pins.length" class="not-found">
      <h5>Sorry, we couldn't find any pins for this search</h5>
    </div>
    <div>
      <Loading :loading="loading" />
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
    },
    loading() {
      return this.$store.state.search.pinsLoading;
    }
  },
  mounted: function() {
    this.$store.commit("search/resetOffset");
    this.$store.dispatch("search/searchPins", {
      name: this.$route.params.name
    });
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/MasonryGrid";
.not-found {
  margin-top: 35vh;
  text-align: center;
}
</style>
