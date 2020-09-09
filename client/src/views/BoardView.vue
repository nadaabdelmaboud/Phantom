<template>
  <div class="profile" @click="clear">
    <div class="boardInfo">
      <h1>{{ board.board.name }}</h1>
      <img
        src="https://images.unsplash.com/photo-1594843310575-90756e33c484?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
      />
      <i 
      class="fa fa-plus globalIcons"
      v-if="board.type == 'creator' || (board.type == 'collaborator' && board.permissions.addCollaborators)"
      @click="addCollaborator"></i>
    </div>
    <div class="stickyBar row  m-0">
      <div class="col-sm-4 col-4 col1">
        <i class="fa fa-pencil" v-if="board.type == 'creator' || board.type == 'collaborator'" aria-hidden="true" @click="editBoard"></i>
        <i class="fa fa-upload" aria-hidden="true"></i>
      </div>
      <div class="col-sm-4 col-4 col2">
        <router-link
          class="buttons"
          :to="{ path: '/Board/' + boardId + '/Pins' }"
          tag="div"
          :class="{ inRoute: inPins }"
        >
          Pins
        </router-link>
        <router-link
          class="buttons"
          :to="{ path: '/Board/' + boardId + '/More' }"
          tag="div"
          :class="{ inRoute: inMore }"
        >
          MoreIdeas
        </router-link>
      </div>
      <div class="col-sm-4 col-4 col3">
        <i
          class="fa fa-plus"
          aria-hidden="true"
          id="create"
          style="float:right;"
          @click="showCreate = !showCreate"
        ></i>
      </div>
    </div>
    <div class="create" v-if="showCreate">
      <p>Create</p>
      <ul>
        <li @click="createBoardPopup">Board</li>
        <router-link tag="li" to="/PinBuilder">Pin</router-link>
      </ul>
      <p v-if="board.type == 'creator'">Add</p>
      <ul v-if="board.type == 'creator' ">
        <li @click="addSection">Section</li>
      </ul>
    </div>
    <router-view> </router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "BoardView",
  data: function() {
    return {
      inPins: true,
      inMore: false,
      showCreate: false,
      showViewOptions: false,
      boardId: ""
    };
  },
  methods: {
    clear(event) {
      if (event.target.id != "create") {
        this.showCreate = false;
      }
      if (event.target.id != "view") {
        this.showViewOptions = false;
      }
    },
    createBoardPopup() {
      this.$store.commit("popUpsState/toggleCreateBoardPopup");
    },
    addCollaborator() {
      this.$store.commit("popUpsState/toggleCollaboratorsPopup");
    },
    editBoard() {
      this.$store.commit("popUpsState/toggleEditBoardPopup");
    },
    addSection(){
      this.$store.commit("popUpsState/toggleAddSection");
    }
  },
  watch: {
    $route: function() {
      if (this.$route.path.includes("/Pins")) {
        this.inMore = false;
        this.inPins = true;
      } else if (this.$route.path.includes("/More")) {
        this.inMore = true;
        this.inPins = false;
      } else {
        this.inMore = false;
        this.inPins = false;
      }
    }
  },
  computed: {
    ...mapGetters({
      board: "boards/currentBoard"
    })
  },
  mounted() {
    this.boardId = this.$route.params.boardId;
  },
  created() {
    this.boardId = this.$route.params.boardId;
    this.$store.dispatch("boards/getBoard", this.$route.params.boardId);
  }
};
</script>

<style lang="scss" scoped>
@import "../scss/Colors";
@import "../scss/mixins";
.boardInfo {
  margin-bottom: 40px;
  img {
    width: 48px;
    border-radius: 50%;
    margin: 0 0 10px calc((100vw - 96px) / 2);
    height: 48px;
    display: inline-block;
  }
  i {
    height: 48px;
    width: 48px;
    font-size: 24px;
    color: $darkBlue;
    border-radius: 50%;
    padding: 12px;
    text-align: center;
    z-index: 2;
    transition: background-color 0.5s ease;
    background-color: white;
    margin-top: 20px;
    margin-left: -24px;
  }
  i:hover {
    background-color: $lightPink;
  }
}
h1,
h6 {
  text-align: center;
  font-weight: 700;
}
h1 {
  font-size: 36px;
}
h6 {
  font-size: 16px;
}
.stickyBar {
  background-color: $offWhite;
  height: 68px;
  position: sticky;
  top: 80px;
  z-index: 10;
  padding: 6px 0;
}
i {
  height: 48px;
  width: 48px;
  font-size: 24px;
  color: $darkBlue;
  border-radius: 50%;
  padding: 12px;
  text-align: center;
  transition: background-color 0.5s ease;
  cursor: pointer;
}
i:hover {
  background-color: $lightPink;
}
.col2 {
  padding: 0 60px;
}
.buttons {
  @include horizontalDivs;
  border-radius: 40px;
  font-size: 16px;
  font-weight: 700;
  padding: 12px;
  margin: 0 5px;
}
.inRoute {
  background-color: $darkBlue;
  color: $lightPink;
}
.inRoute:hover {
  background-color: $darkBlue;
  color: $lightPink;
}
.create {
  @include optionsList;
  padding: 10px;
  width: 200px;
  right: 30px;
  p {
    font-size: 12px;
  }
}
.view {
  right: 80px;
}
</style>
