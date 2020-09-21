<template>
  <div>
    <Board
      v-for="board in boards"
      :key="board._id"
      :boardName="board.name"
      :boardId="board._id"
      :isPrivate="false"
      :pinsCount="board.pins.length"
      :pinsImages="board.coverImages"
      :isBoard="true"
      class="col-sm-2"
    />
  </div>
</template>

<script>
import Board from "../Board.vue";
export default {
  computed: {
    boards() {
      return this.$store.state.search.boards;
    }
  },
  components: {
    Board
  },
  mounted: function() {
    this.$store.dispatch("search/searchBoards", {
      name: this.$route.params.name
    });
  }
};
</script>
