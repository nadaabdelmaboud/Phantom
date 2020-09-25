<template>
  <div>
    <Loading v-if="loading" :loading="loading" />
    <div class="masonryGrid">
      <HomeCard
        class="masonryGridItem"
        v-for="p in pins"
        :key="p._id"
        :cardImage="p.imageId"
        :postPageId="p._id"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HomeCard from "../../components/HomeCard";
import Loading from "../../components/GeneralComponents/Loading";
export default {
  name: "UserPins",
  components: {
    HomeCard,
    Loading
  },
  created() {
    let myprofile = this.$route.path.includes("/UserProfile");
    if (!myprofile) {
      let userId = this.$route.params.userId;
      this.$store.dispatch("pins/getUserPins", userId);
    } else {
      this.$store.dispatch("pins/getMyPins");
    }
  },
  computed: {
    ...mapGetters({
      pins: "pins/pins",
      loading: "pins/loading"
    })
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/MasonryGrid";
.masonry {
  width: 95%;
  margin: auto;
}
</style>
