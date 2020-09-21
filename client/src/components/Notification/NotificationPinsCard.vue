<template>
  <div class="card" @click="toPage">
    <label>{{ title }}</label>
    <p>{{ body }}</p>
    <div class="imageGrid">
      <div class="img img1">
        <img v-if="imageIds.length >= 1" v-lazy="getImage(imageIds[0])" />
      </div>
      <div class="img img2">
        <img v-if="imageIds.length >= 2" v-lazy="getImage(imageIds[1])" />
      </div>
      <div class="img img3">
        <img v-if="imageIds.length >= 3" v-lazy="getImage(imageIds[2])" />
      </div>
      <div class="img img4">
        <img v-if="imageIds.length >= 4" v-lazy="getImage(imageIds[3])" />
      </div>
      <div class="img img5">
        <img v-if="imageIds.length >= 5" v-lazy="getImage(imageIds[4])" />
      </div>
    </div>
  </div>
</template>

<script>
import { default as getImage } from "../../mixins/getImage";
export default {
  name: "NotificationsPinsCard",
  data: function() {
    return {};
  },
  mixins: [getImage],
  props: {
    imageIds: {
      type: Array,
      default: () => []
    },
    title: {
      type: String
    },
    body: {
      type: String
    },
    pins: {
      type: Array
    },
    boards: {
      type: Array
    }
  },
  methods: {
    toPage() {
      if (this.title == "Boards For You!") {
        this.$router.push("/BoardForYou");
        let boards = JSON.stringify(this.boards);
        if(localStorage.getItem("notificationBoards"))
        localStorage.removeItem("notificationBoards")
        localStorage.setItem("notificationBoards",boards)
      } else {
        this.$router.push("/PinsForYou");
        let pins = JSON.stringify(this.pins);
        if(localStorage.getItem("notificationPins"))
        localStorage.removeItem("notificationPins")
        localStorage.setItem("notificationPins",pins)
      }
      this.$store.commit("notifications/alterShow", false);
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
  width: 100%;
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
  // object-fit: cover;
}
.card {
  border: none;
  border-radius: 16px;
  padding: 10px;
  transition: 0.3s linear;
  margin: 5px 0;
  background-color: $queenPink;
  cursor: pointer;
}
.card:hover {
  background-color: $queenPinkHover;
}
img {
  border-radius: 16px;
  width: 100%;
  height: 100%;
}
label,
p {
  margin: 0;
  color: $queenBlue;
}
p {
  font-size: 14px;
}
</style>
