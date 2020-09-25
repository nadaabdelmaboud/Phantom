<template>
  <div id="edit" @click="editPopup">
    <div class="editBoard" v-if="editState == 1">
      <h3>Edit your Board</h3>
      <div class="formBoard">
        <div
          v-if="
            board.type == 'creator' ||
              (board.type == 'collaborator' && board.permissions.editTitle)
          "
        >
          <label>Name</label>
          <br />
          <input class="inputFields" type="text" value="" v-model="name" />
          <br />
        </div>
        <div
          v-if="
            board.type == 'creator' ||
              (board.type == 'collaborator' &&
                board.permissions.editDescription)
          "
        >
          <label>Description</label>
          <br />
          <input
            class="inputFields"
            type="text"
            value=""
            v-model="description"
          />
          <br />
        </div>
        <div v-if="board.type == 'creator'">
          <label>Dates · Optional – this can help you plan!</label>
          <br />
          <date-range-picker
            ref="picker"
            :locale-data="{ firstDay: 1, format: 'mm/dd/yyyy' }"
            :minDate="minDate"
            :maxDate="maxDate"
            :opens="'right'"
            :timePicker="false"
            :showWeekNumbers="false"
            :showDropdowns="true"
            :control-container-class="'custumClass'"
            :autoApply="true"
            v-model="dateRange"
            @toggle="checkOpen = !checkOpen"
            :always-show-calendars="false"
            :linkedCalendars="true"
          >
          </date-range-picker>
          <br />
        </div>
        <div
          v-if="
            board.type == 'creator' ||
              (board.type == 'collaborator' &&
                board.permissions.personalization)
          "
        >
          <label>
            Personalisation <br />
            Show Pins inspired by this board in your home feed.
          </label>
          <input
            type="range"
            min="1"
            max="2"
            value="2"
            class="slider"
            id="myRange"
            v-model="status"
            :class="{ isPrivate: status == 2 }"
          />
          <br />
          <div v-if="board.type == 'creator'">
            <label v-if="board.board.sections.length">
              Board sections
            </label>
            <div class="section" v-for="s in board.board.sections" :key="s._id">
              <img
                :src="getImage(s.coverImages[0])"
                v-if="!s.coverImages.length"
              />
              <img :src="getImage('')" v-else />
              <p>{{ s.sectionName }}</p>
              <button class="editButton" @click="deleteSection(s._id)">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="buttonDiv actionsButton">
        <button @click="editBoard">
          Done
        </button>
        <button
          v-if="board.type == 'creator'"
          @click="editState = 2"
          class="leftButton"
        >
          Delete
        </button>
        <button
          v-if="board.type == 'creator'"
          @click="editState = 3"
          class="leftButton"
        >
          Merge
        </button>
      </div>
    </div>
    <div class="editBoard" v-if="editState == 2">
      <h3>Delete Board</h3>
      <h6>
        Once you delete a board and all of its Pins, you can't undo it.
      </h6>
      <button class="editButton" @click="editState = 1">
        Cancel
      </button>
      <button class="editButton" @click="deleteBoard">
        Delete forever
      </button>
    </div>
    <div class="editBoard" v-if="editState == 3" @click="hideBoard">
      <h3 v-if="MergeTo == 'Pick a board'">Move all pins to...</h3>
      <h3 v-if="MergeTo != 'Pick a board'">Move Pins and delete board?</h3>
      <div
        class="mergeOptions"
        id="showControl"
        @click="showBoard = !showBoard"
      >
        {{ MergeTo }}
      </div>
      <div class="searchList" v-if="showBoard">
        <input type="text" v-model="searchBoard" placeholder="Search" />
        <ul v-for="(b, i) in userBoards" :key="i">
          <li
            v-if="
              b.board.name.search(new RegExp(searchBoard, 'i')) != -1 &&
                board.board._id != b.board._id
            "
            @click="selectMerge(b.board.name, b.board._id)"
          >
            {{ b.board.name }}
          </li>
        </ul>
      </div>
      <div v-if="MergeTo != 'Pick a board'">
        <br />
        <p>
          You're about to move all the Pins from your "{{ name }}" board to a
          new section in your "{{ MergeTo }}" board.
        </p>
        <p>
          When you delete "{{ name }}", you'll lose all followers of that board.
        </p>
      </div>

      <div class="buttonDiv mergeButton">
        <button
          :class="{ disable: MergeTo == 'Pick a board' }"
          @click="mergeBoard"
        >
          Move Pins and Delete Board
        </button>
        <button
          @click="(editState = 1), (MergeTo = 'Pick a board'), (MergeToId = '')"
          class="leftButton"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import { mapGetters } from "vuex";
import { default as getImage } from "../../mixins/getImage";
export default {
  name: "EditPopup",
  mixins: [getImage],
  data: function() {
    return {
      name: "",
      description: "",
      status: 2,
      editState: 1,
      minDate: new Date(),
      maxDate: null,
      dateRange: {
        startDate: new Date(),
        endDate: new Date()
      },
      checkOpen: false,
      MergeTo: "Pick a board",
      MergeToId: "",
      showBoard: false,
      searchBoard: ""
    };
  },

  components: {
    DateRangePicker
  },
  methods: {
    editPopup(event) {
      if (event.target.id == "edit") {
        this.$store.commit("popUpsState/toggleEditBoardPopup");
      }
    },
    editBoard() {
      let newBoard = {
        name: this.name,
        description: this.description,
        personalization: false
      };
      if (this.status == 2) newBoard.personalization = true;
      this.$store.dispatch("boards/editBoard", newBoard);
      this.$store.commit("popUpsState/toggleEditBoardPopup");
    },
    deleteBoard() {
      this.$store.dispatch("boards/deleteBoard");
      this.$store.commit("popUpsState/toggleEditBoardPopup");
      this.$router.go(-1);
    },
    selectMerge(name, id) {
      this.MergeTo = name;
      this.MergeToId = id;
      this.showBoard = false;
    },
    mergeBoard() {
      if (this.MergeToId != "") {
        let merge = {
          mergedBoardId: this.board.board._id,
          originalBoardId: this.MergeToId
        };
        this.$store.dispatch("boards/mergeBoard", merge);
        this.$store.commit("popUpsState/toggleEditBoardPopup");
        this.$router.go(-1);
      }
    },
    hideBoard(event) {
      console.log(event.target.id);
      if (event.target.id != "showControl") this.showBoard = false;
    },
    deleteSection(sectionId) {
      this.$store.dispatch("boards/deleteSection", {
        boardId: this.board.board._id,
        sectionId: sectionId
      });
    }
  },
  computed: {
    ...mapGetters({
      board: "boards/currentBoard",
      userBoards: "boards/userBoards"
    })
  },
  created() {
    this.name = this.board.board.name;
    this.description = this.board.board.description;
    this.$store.dispatch("boards/userBoards");
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/Mixins";
@import "../../scss/GlobalPopup";

#edit {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 12;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.editBoard {
  margin: 90px auto;
  background-color: white;
  width: 450px;
  padding: 20px;
  border-radius: 32px;
}
@media screen and (max-width: 500px) {
  .editBoard {
    margin: 50px auto;
    width: 97%;
  }
}
h3 {
  width: 100%;
  text-align: center;
}
.editButton {
  position: relative;
  width: 100%;
  float: none;
}
.editButton:nth-child(3) {
  margin: 10px 0;
  background-color: $lightPink;
  color: $darkBlue;
}
.formBoard {
  height: 50vh;
  overflow-y: auto;
}
.mergeOptions {
  text-align: center;
  height: 48px;
  border-radius: 16px;
  padding: 9px 0;
  font-size: 20px;
  color: $darkBlue;
  background-color: $lightPink;
  transition: 0.5s linear;
  cursor: pointer;
  margin-top: 30px;
}
.mergeOptions:hover {
  background-color: $lightPinkHover;
}
.section {
  display: flex;
  margin: 5px 0;
  img {
    width: 48px;
    border-radius: 50%;
    align-self: start;
  }
  p {
    margin: 0;
    font-size: 16px;
    min-height: 48px;
    padding: 10px 10px;
    width: 80%;
  }
  button {
    width: 100px;
  }
}
.mergeButton {
  button:nth-child(1) {
    width: 75%;
    padding: 5px;
  }
  button:nth-child(2) {
    padding: 10px;
    width: 20%;
  }
}
.actionsButton {
  button {
    padding: 5px;
    width: 25%;
  }
}
@media screen and (max-width: 500px) {
  .mergeButton {
    button {
      padding: 3px;
      font-size: 14px;
    }
    button:nth-child(1) {
      width: 70%;
    }
    button:nth-child(2) {
      width: 25%;
    }
  }
}
</style>
