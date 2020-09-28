+6<template>
  <div class="flexWrap spread">
    <div class="masonryGrid">
      <HomeCard
        v-for="p in pins"
        :key="p._id"
        :cardImage="p.imageId"
        :postPageId="p._id"
        class="masonryGridItem"
      />
    </div>
  </div>
</template>

<script>
import HomeCard from "../Home/HomeCard";

export default {
  name: "NotificationPins",
  data: function() {
    return {
      pins: []
    };
  },
  components: {
    HomeCard
  },
  created() {
    this.pins = localStorage.getItem("notificationPins");
    this.pins = JSON.parse(this.pins);
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/MasonryGrid";
.spread {
  margin: 0;
  padding: 90px 40px;
  width: 100%;
  background-color: $offWhite;
}
</style>
