<template>
  <div>
    <Loading :loading="loadingMore" />
    <div v-if="!loadingMore" class="flexWrap">
      <masonry
        :cols="{ default: 5, 1500: 4, 1200: 3, 800: 2, 580: 1 }"
        :gutter="{ default: '30px', 700: '20px', 500: '10px' }"
      >
        <HomeCard
          v-for="p in morePins"
          :key="p._id"
          :cardImage="p.imageId"
          :postPageId="p._id"
        />
      </masonry>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HomeCard from "../../components/Home/HomeCard";
import Loading from "../../components/GeneralComponents/Loading";
export default {
  name: "BoardMoreLike",
  data: function() {
    return {
      boardId: ""
    };
  },
  components: {
    HomeCard,
    Loading
  },
  computed: {
    ...mapGetters({
      morePins: "boards/moreLike",
      loadingMore: "boards/loadingMore"
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
@import "../../scss/MasonryGrid";
</style>
