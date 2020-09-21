<template>
  <div class="wrapper">
    <Board
      v-for="board in boards"
      class="board"
      :key="board._id"
      :boardId="board._id"
      :boardName="board.name"
      :pinsImages="board.coverImages"
      :pinsCount="board.pins.length"
      :isBoard="true"
    />
  </div>
</template>

<script>
import Board from "../Board";

export default {
  name: "NotificationPins",
  data: function() {
    return {
      boards: []
    };
  },
  components: {
    Board
  },
  created() {
    this.boards = localStorage.getItem("notificationBoards");
    this.boards = JSON.parse(this.boards);
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/MasonryGrid";
.wrapper {
  // padding: 10px 10%;
  display: flex;
  flex-wrap: wrap;
}

.board {
  margin: 6px;
  width: 24%;
}
@media screen and (max-width: 850px) {
  .board {
    width: 30%;
  }
}
@media screen and (max-width: 400px) {
  .board {
    width: 45%;
  }
}
@media screen and (max-width: 270px) {
  .board {
    width: 95%;
  }
}
</style>
