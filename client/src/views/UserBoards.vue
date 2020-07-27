<template>
  <div class="home">
    <div class="row m-0">
   <Board v-for="board in boards" class="col-sm-3"
   :key="board.board._id"
   :boardName="board.board.name"
   :pinsImages="board.board.coverImages"
   :pinsCount="board.board.counts.pins"
   />
   </div>
  </div>
</template>

<script>
import Board from "../components/Board";
import { mapGetters } from "vuex";
export default {
  name: "UserBoards",
  mounted() {
    this.$store.dispatch("boards/userBoards");
  },
  components: {
    Board
  },
  computed: {
    ...mapGetters({
      boards: "boards/userBoards"
    })
  }
};
</script>

<style lang="scss" scoped>
</style>
