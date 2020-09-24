<template>
  <div>
    <div v-if="boards.length">
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
    <div v-if="!loading && !boards.length" class="not-found">
      <h5>
        Sorry, we couldn't find any boards about
        <strong>{{ this.$route.params.name }}</strong>
      </h5>
      <h5>Please try another search</h5>
    </div>
    <div>
      <Loading :loading="loading" />
    </div>
  </div>
</template>

<script>
import Board from "../Board.vue";
import Loading from "../GeneralComponents/Loading";

export default {
  computed: {
    boards() {
      return this.$store.state.search.boards;
    },
    loading() {
      return this.$store.state.search.loading;
    }
  },
  components: {
    Board,
    Loading
  },
  mounted: function() {
    this.$store.dispatch("search/searchBoards", {
      name: this.$route.params.name
    });
  }
};
</script>

<style scoped>
.not-found {
  margin-top: 35vh;
  text-align: center;
}
</style>
