<template>
  <div class="phantomCard" :style="gridStyle" @click="showPopup">
    <img v-lazy="getImage(cardImage)" class="card-img" alt="Card image" />
  </div>
</template>

<style lang="scss" scoped>
@import "../../scss/_Colors";
@import "../../scss/Mixins";
.phantomCard {
  width: 252px;
  background-color: $blue;
  // background: transparent;
  border: transparent;
  border-radius: 25px;
  &:hover {
    box-shadow: 0 2px 2px 3px rgba(0, 0, 0, 0.05);
  }
}
.card-img {
  background-size: cover;
  border-radius: 25px;
  object-fit: cover;
  min-height: 200px;
  max-height: 600px;
}
</style>

<script>
import { default as getImage } from "../../mixins/getImage";
export default {
  name: "PhantomCard",
  mixins: [getImage],
  props: {
    index: {
      type: String
    },
    cardImage: {
      type: String
    }
  },
  computed: {
    gridStyle() {
      return {
        cardIndex: this.index
      };
    }
  },
  methods: {
    showPopup() {
      this.$store.commit("popUpsState/togglePhantomPopup");
      setTimeout(() => {
        this.$store.commit("popUpsState/togglePhantomPopup");
      }, 3000);
    }
  }
};
</script>
