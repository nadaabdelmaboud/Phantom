+6<template>
  <div class="flexWrap spread">
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
