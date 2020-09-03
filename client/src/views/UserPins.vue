<template>
  <div class="masonry">
    <HomeCard
      class="masonryItem"
      v-for="p in pins"
      :key="p._id"
      :cardImage="p.imageId"
      :postPageId="p._id"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HomeCard from "../components/HomeCard";
export default {
  name: "UserPins",
  components: {
    HomeCard
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
      pins: "pins/pins"
    })
  }
};
</script>

<style lang="scss" scoped>
@import "../scss/MasonryGrid";
.masonry {
  width: 95%;
  margin: auto;
}
</style>
