<template>
  <div>
    <div class="row m-0 justify-content-center">
      <div class="col-9">
        <div class="row m-0">
          <Board
            v-for="b in board.board.sections"
            class="col-sm-4"
            :key="b._id"
            :boardId="boardId"
            :boardName="b.sectionName"
            :pinsImages="b.coverImages"
            :pinsCount="b.pins.length"
            :boardObject="b"
            :isBoard="false"
            :sectionId="b._id"
          />
        </div>
      </div>
    </div>

    <div class="flexWrap">
      <masonry
        :cols="{ default: 5, 1500: 4, 1200: 3, 800: 2, 580: 1 }"
        :gutter="{ default: '30px', 700: '20px', 500: '10px' }"
      >
        <HomeCard
          v-for="b in board.pins"
          :key="b.pin._id"
          :cardImage="b.pin.imageId"
          :postPageId="b.pin._id"
        />
      </masonry>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HomeCard from "../../components/Home/HomeCard";
import Board from "../../components/Board";

export default {
  name: "BoardPins",
  data: function() {
    return {
      boardId: ""
    };
  },
  components: {
    Board,
    HomeCard
  },
  computed: {
    ...mapGetters({
      board: "boards/currentBoard"
    })
  },
  methods: {},
  created: function() {
    this.boardId = this.$route.params.boardId;
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/MasonryGrid";
</style>
