<template>
  <div class="card">
    <p>this is a notification message</p>
    <div class="imageGrid">
      <div class="img img1">
        <img v-if="imageIds.length >= 1" />
      </div>
      <div class="img img2">
        <img v-if="imageIds.length >= 2" />
      </div>
      <div class="img img3">
        <img v-if="imageIds.length >= 3" />
      </div>
      <div class="img img4">
        <img v-if="imageIds.length >= 4" />
      </div>
      <div class="img img5">
        <img v-if="imageIds.length >= 5" />
      </div>
    </div>
  </div>
</template>

<script>
//import { default as getImage } from "../mixins/getImage";
export default {
  name: "BoardPins",
  data: function() {
    return {};
  },
  props: {
    imageIds: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
.imageGrid {
  display: grid;
  grid-template: 80px 80px/ 80px 80px 80px;
  grid-template-areas:
    "img1 img2 img3"
    "img1 img4 img5";
  gap: 3px 3px;
  align-content: center;
  justify-content: start;
  margin: 15px 0;
}
.img1 {
  grid-area: img1;
}
.img2 {
  grid-area: img2;
}
.img3 {
  grid-area: img3;
}
.img4 {
  grid-area: img4;
}
.img5 {
  grid-area: img5;
}
.img {
  border-radius: 16px;
  background-color: $offWhite;
}
.card {
  border: none;
  border-radius: 16px;
  padding: 10px;
  transition: 0.2s linear;
}
.card:hover {
  background-color: $lightPink;
}
</style>
