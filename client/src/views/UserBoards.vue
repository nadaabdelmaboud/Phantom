<template>
  <div class="home">
    <Board v-for="board in boards" :key="board._id" />
  </div>
</template>

<script>
import Board from "../components/Board";
import { mapGetters } from "vuex";
export default {
  name: "UserBoards",
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

<style lang="scss" scoped></style>
