<template>
  <div class="masonry">
    <HomeCard
      v-for="homecard in pins"
      :key="homecard._id"
      class="masonryItem"
      :cardImage="homecard.imageId"
      :postPageId="homecard._id"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HomeCard from "../HomeCard";

export default {
  name: "NotificationPins",
  data: function() {
    return {};
  },
  components: {
    HomeCard
  },
  computed: {
    ...mapGetters({
      pins: "notifications/pins"
    })
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/MasonryGrid";
.masonry {
  margin: 20px;
}
</style>
