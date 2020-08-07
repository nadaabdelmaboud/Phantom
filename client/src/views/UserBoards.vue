<template>
  <div class="home">
    <div class="row m-0">
      <draggable class="dragStyle" @end="ReorderBoards">
        <Board
          v-for="board in boards"
          class="col-sm-3"
          :key="board.board._id"
          :boardId="board.board._id"
          :boardName="board.board.name"
          :pinsImages="board.board.coverImages"
          :pinsCount="board.board.counts.pins"
          :boardObject="board"
        />
      </draggable>
    </div>
  </div>
</template>

<script>
import Board from "../components/Board";
import { mapGetters } from "vuex";
import draggable from "vuedraggable";

export default {
  name: "UserBoards",
  mounted() {
    this.$store.dispatch("boards/userBoards");
  },
  components: {
    Board,
    draggable
  },
  methods: {
    ReorderBoards(event) {
      this.$store.dispatch("boards/reorderBoards", {
        from: event.oldIndex,
        to: event.newIndex + 1
      });
    }
  },
  computed: {
    ...mapGetters({
      boards: "boards/userBoards"
    })
  }
};
</script>

<style lang="scss" scoped>
.dragStyle {
  width: 100%;
}
</style>
