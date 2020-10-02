<template>
  <div class="board" @click="toBoard">
    <div class="boardInner">
      <div class="image">
        <img v-if="pinsImages.length" :src="getImage(pinsImages[0])" />
      </div>
      <div class="image">
        <div class="imagesmall">
          <img v-if="pinsCount >= 2" :src="getImage(pinsImages[1])" />
        </div>
        <div class="imagesmall">
          <img v-if="pinsCount >= 3" :src="getImage(pinsImages[2])" />
        </div>
      </div>
    </div>
    <div>
      <p>{{ boardName }}</p>
      <p>{{ pinsCount }} pins</p>
    </div>
  </div>
</template>

<script>
import { default as getImage } from "../mixins/getImage";

export default {
  name: "Board",
  mixins: [getImage],
  props: {
    boardName: {
      type: String
    },
    boardId: {
      type: String
    },
    pinsImages: {
      type: Array
    },
    isPrivate: {
      type: Boolean
    },
    createdAt: {
      type: Date
    },
    pinsCount: {
      type: Number
    },
    isBoard: {
      type: Boolean
    },
    sectionId: {
      type: String
    }
  },
  methods: {
    toBoard() {
      if (this.isBoard) this.$router.push("/Board/" + this.boardId + "/Pins");
      else this.$router.push("/Section/" + this.boardId + "/" + this.sectionId);
    }
  }
};
</script>

<style lang="scss" scoped>
.board {
  margin-top: 20px;
  display: inline-block;
  cursor: pointer;
}
.boardInner {
  height: 250px;
}
@media screen and (max-width: 950px) and (min-width: 500px) {
  .boardInner {
    height: 160px;
  }
}
@media screen and (min-width: 2100px) {
  .boardInner {
    height: 350px;
  }
}
@media screen and (max-width: 6500px) {
  .lefted_icon {
    left: -120px;
  }
}
.image {
  background-color: white;
  display: inline-block;
  margin: 2%;
  height: 96%;
  width: 66%;
  border-radius: 16px;
  img {
    width: 100%;
    display: block;
    border-radius: 16px;
    height: 100%;
  }
}
.image:nth-child(2) {
  width: 26%;
  background-color: transparent;
  .imagesmall {
    background-color: white;
    height: 47%;
    border-radius: 16px;
  }
  .imagesmall:nth-child(1) {
    margin-bottom: 6%;
  }
}
p {
  margin-bottom: 10px;
  margin-left: 2%;
}
</style>
