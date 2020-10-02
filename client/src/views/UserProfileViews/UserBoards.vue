<template>
  <div class="home">
    <Loading v-if="loading" :loading="loading" />
    <div class="row m-0">
      <div
        class="boardsDefault"
        :class="[
          {
            boards: myprofile && viewState == 'Compact'
          }
        ]"
      >
        <draggable
          class="dragStyle"
          @end="ReorderBoards"
          :sort="myprofile && myData.sortType == 'Reorder'"
        >
          <Board
            v-for="board in boards"
            :class="[
              {
                'col-sm-3': viewState == 'Compact',
                'col-sm-2': !myprofile || viewState == 'Default'
              }
            ]"
            :key="board.board._id"
            :boardId="board.board._id"
            :boardName="board.board.name"
            :pinsImages="board.board.coverImages"
            :pinsCount="board.board.pins.length"
            :isBoard="true"
            @click.native="toBoard(board.board._id)"
          />
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import Board from "../../components/Board";
import Loading from "../../components/GeneralComponents/Loading";
import { mapGetters, mapState } from "vuex";
import draggable from "vuedraggable";

export default {
  name: "UserBoards",
  date: function() {
    return {
      myprofile: ""
    };
  },
  created() {
    this.myprofile = this.$route.path.includes("/UserProfile");
    if (!this.myprofile) {
      let userId = this.$route.params.userId;
      this.$store.dispatch("boards/getUserBoards", userId);
    } else {
      this.$store.dispatch("boards/userBoards");
      this.$store.dispatch("boards/getViewState");
    }
  },
  components: {
    Board,
    draggable,
    Loading
  },
  methods: {
    ReorderBoards(event) {
      if (this.myprofile && this.myData.sortType == "Reorder") {
        this.$store.dispatch("boards/reorderBoards", {
          from: event.oldIndex,
          to: event.newIndex + 1
        });
      }
    },
    toBoard(boardId) {
      this.$router.push("/Board/" + boardId + "/Pins");
    }
  },
  computed: {
    ...mapGetters({
      boards: "boards/userBoards",
      viewState: "boards/viewState",
      loading: "boards/loading"
    }),
    ...mapState({
      myData: state => state.user.userData
    })
  }
};
</script>

<style lang="scss" scoped>
.dragStyle {
  width: 100%;
}
.boardsDefault {
  width: 100%;
}
.boards {
  width: 85%;
  margin: 0 auto;
}
</style>
