<template>
  <div class="flexWrap">
    <div class="masonry">
      <HomeCard
        v-for="p in morePins"
        :key="p._id"
        :cardImage="p.imageId"
        :postPageId="p._id"
        class="masonryItem"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HomeCard from "../components/HomeCard";
export default {
  name: "BoardMoreLike",
  data: function() {
    return {
      boardId: ""
    };
  },
  components: {
    HomeCard
  },
  computed: {
    ...mapGetters({
      morePins: "boards/moreLike"
    })
  },
  created: function() {
    console.log(this.$route);
    this.boardId = this.$route.params.boardId;
    this.$store.dispatch("boards/moreLike", this.boardId);
  }
};
</script>

<style lang="scss" scoped>
@import "../scss/MasonryGrid";
.flexWrap {
  margin: auto;
  width: 90%;
}
</style>
