<template>
  <div>
    <div class="row m-0 justify-content-center">
      <div class="col-9">
        <div class="row m-0">
          <Board
            v-for="b in board.board.sections"
            class="col-sm-4"
            :key="b._id"
            :boardId="b._id"
            :boardName="b.sectionName"
            :pinsImages="b.coverImages"
            :pinsCount="b.pins.length"
            :boardObject="b"
          />
        </div>
      </div>
    </div>

    <div class="row m-0">
      <HomeCard  
      v-for="b in board.pins" 
      :key="b.pin._id"
      />
    </div>
  </div>
</template>

<script>
//import { default as getImage } from "../mixins/getImage";
import { mapGetters } from "vuex";
import HomeCard from "../components/HomeCard";
import Board from "../components/Board";
export default {
  name: "BoardPins",
  data: function() {
    return {
      boardId: "",
    };
  },
  components: {
    Board,
    HomeCard
  },
  computed: {
    ...mapGetters({
      board: "boards/currentBoard",
    }),
  },
  created: function() {
    this.boardId = this.$route.params.boardId;
    //this.$store.dispatch("boards/getBoard", this.$route.params.boardId);
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/Colors";
</style>
