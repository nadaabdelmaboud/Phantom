<template>
  <div id="edit" @click="editPopup">
    <div class="editBoard" v-if="editState == 1">
      <h3>Edit your Board</h3>
      <div class="formBoard">
      <label>Name</label>
      <br />
      <input
        class="inputFields"
        type="text"
        value=""
        v-model="name"
      />
      <br />
      <label>Description</label>
      <br />
      <input
        class="inputFields"
        type="text"
        value=""
        v-model="description"
      />
      <br />
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
      <label>
        Keep this board secret <br />
        So only you and collaborators can see it. Learn more
      </label>
      <input
        type="range"
        min="1"
        max="2"
        value="1"
        class="slider"
        id="myRange"
        v-model="status"
        :class="{ isPrivate: status == 2 }"
      />
           <br />
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
        :class="{ isPrivate: status == 2 }"
      />
      </div>
      <div class="buttonDiv">
        <button @click="editBoard">
          Done
        </button>
        <button @click="editState = 2" class="leftButton">
          Delete
        </button>
        <button @click="editState = 3" class="leftButton">
          Merge
        </button>
        <button class="leftButton">
          Archeive
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
      <div class="mergeOptions" id="showControl" @click="showBoard = !showBoard">{{MergeTo}}</div>
      <div v-if="MergeTo != 'Pick a board'">
        <br/>
      <p>
        You're about to move all the Pins from your "{{name}}" board to a new section in your "{{MergeTo}}" board.
      </p>
      <p>
         When you delete "{{name}}", you'll lose all followers of that board.
      </p>
      </div>
      <div class="boards" v-if="showBoard">
        <input type="text" v-model="searchBoard" placeholder="Search" />
        <ul v-for="(b, i) in userBoards" :key="i">
          <li
            v-if="b.board.name.search(new RegExp(searchBoard, 'i')) != -1 && board.board._id != b.board._id"
            @click="selectMerge(b.board.name,b.board._id)"
          >
            {{ b.board.name }}
          </li>
        </ul>
      </div>
      <div class="buttonDiv">
        <button 
        :class="{disable: MergeTo == 'Pick a board'}"
        @click="mergeBoard">
        Move Pins and Delete Board</button>
        <button 
        @click="editState = 1,MergeTo = 'Pick a board',MergeToId=''"
        class="leftButton"
        >Cancel</button>

      </div>
    </div>
  </div>
</template>

<script>
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import { mapGetters } from "vuex";
export default {
  name: "EditPopup",
  data: function() {
    return {
      name: "",
      description: "",
      status: 1,
      editState: 1,
      minDate: new Date(),
      maxDate: null,
      dateRange: {
        startDate: new Date(),
        endDate: new Date()
      },
      checkOpen: false,
      MergeTo:"Pick a board",
      MergeToId:"",
      showBoard:false,
      searchBoard:""
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
        status: "public"
      };
      if (this.status == 2) newBoard.status = "private";
      this.$store.dispatch("boards/editBoard", newBoard);
      this.$store.commit("popUpsState/toggleEditBoardPopup");
    },
    deleteBoard() {
      this.$store.dispatch("boards/deleteBoard");
      this.$store.commit("popUpsState/toggleEditBoardPopup");
      this.$router.go(-1);
    },
    selectMerge(name,id){
      this.MergeTo = name;
      this.MergeToId = id;
      this.showBoard = false;
    },
    mergeBoard(){
      if(this.MergeToId != "")
       { 
        let merge={
          mergedBoardId: this.board.board._id,
          originalBoardId: this.MergeToId
        }
        this.$store.dispatch("boards/mergeBoard",merge);
        this.$store.commit("popUpsState/toggleEditBoardPopup");
        this.$router.go(-1);
       }

    },
    hideBoard(event){
      console.log(event.target.id)
      if(event.target.id != 'showControl')
        this.showBoard =false
    }
  },
  computed: {
    ...mapGetters({
      board: "boards/currentBoard",
      userBoards: "boards/userBoards"
    }),
  },
  created() {
    this.name = this.board.board.name;
    this.description = this.board.board.description;
    if (this.board.board.status == "public") this.status = 1;
    this.$store.dispatch("boards/userBoards");
  },
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import '../../scss/Mixins';
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
.formBoard{
    height: 400px;
    overflow-y: auto;
}
.mergeOptions{
  text-align: center;
  height: 48px;
  border-radius: 16px;
  padding: 9px 0;
  font-size: 20px;
  color:$darkBlue;
  background-color: $lightPink;
  transition: 0.5s linear;
  cursor: pointer;
  margin-top:30px
}
.mergeOptions:hover{
   background-color: $lightPinkHover;
}
.boards {
  @include optionsList;
  width:400px;
  margin-top: 10px;
  max-height: 400px;
  overflow-y: auto;
}
</style>
