<template>
  <div id="createBoard" @click="createBoardPopup">
    <div class="boardData">
      <p>Create Board</p>
      <label>Name</label>
      <br />
      <input
        class="inputFields"
        type="text"
        v-model="boardName"
        value=""
        placeholder='E.g "Places to go" or "Receipes to make"'
        @input="noName = boardName == ''"
        :class="{ noInput: noName }"
      />
      <br />
      <p v-if="noName" class="invalid">Don't forget to name your board!</p>
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
        Personalisation <br />
        Show Pins inspired by this board in your home feed.
      </label>
      <input
        type="range"
        min="1"
        max="2"
        value="1"
        class="slider"
        id="myRange"
        v-model="isPrivate"
        :class="{ isPrivate: isPrivate == 2 }"
      />
      <div class="buttonDiv">
        <button :class="{ disable: boardName == '' }" @click="createBoard">
          Create
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

export default {
  name: "createBoard",
  data: function() {
    return {
      boardName: "",
      noName: false,
      minDate: new Date(),
      maxDate: null,
      dateRange: {
        startDate: new Date(),
        endDate: new Date()
      },
      checkOpen: false,
      isPrivate: 1
    };
  },
  components: {
    DateRangePicker
  },
  methods: {
    createBoardPopup(event) {
      if (event.target.id == "createBoard")
        this.$store.commit("popUpsState/toggleCreateBoardPopup");
    },
    createBoard() {
      if (this.boardName != "") {
        let boardData = {
          name: this.boardName,
          startDate: this.dateRange.startDate,
          endDate: this.dateRange.endDate,
          status: "public"
        };
        if (this.isPrivate == 2) boardData.status = "private";
        this.$store.dispatch("boards/createBoard", boardData);
        this.$store.commit("popUpsState/toggleCreateBoardPopup");
      }
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/GlobalPopup";
</style>
