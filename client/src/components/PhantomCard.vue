<template>
  <div class="phantomCard" :style="gridStyle">
    <img v-lazy="getImage(cardImage)" class="card-img" alt="Card image" />
  </div>
</template>

<style lang="scss" scoped>
.phantomCard {
  width: 252px;
  background-color: $blue;
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
}
</style>

<script>
export default {
  name: "PhantomCard",
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
  }
};
</script>
