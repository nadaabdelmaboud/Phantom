<template>
  <div>
    <Loading v-if="loading" :loading="loading" />
    <masonry
      :cols="{ default: 5, 1500: 4, 1200: 3, 800: 2, 580: 1 }"
      :gutter="{ default: '30px', 700: '20px', 500: '10px' }"
    >
      <HomeCard
        v-for="p in pins"
        :key="p._id"
        :cardImage="p.imageId"
        :postPageId="p._id"
      />
    </masonry>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HomeCard from "../../components/Home/HomeCard";
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
