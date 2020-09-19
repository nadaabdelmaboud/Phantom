<template>
  <div class="flexWrap">
    <div class="masonryGrid">
      <HomeCard
        v-for="p in morePins"
        :key="p._id"
        :cardImage="p.imageId"
        :postPageId="p._id"
        class="masonryGridItem"
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
  methods: {},
  created: function() {
    this.boardId = this.$route.params.boardId;
    this.$store.dispatch("boards/generateMoreLike", this.boardId);
    setTimeout(() => {
      this.$store.dispatch("boards/moreLike", {
        boardId: this.boardId,
        limit: 8
      });
    }, 3000);
  }
};
</script>

<style lang="scss" scoped>
@import "../scss/MasonryGrid";
</style>
