<template>
  <div id="edit" @click="editPopup">
    <div class="editBoard" v-if="editState==1">
         <p>Create Board</p>
      <label>Name</label>
      <br />
      <input
        class="inputFields"
        type="text"
        value=""
        placeholder='E.g "Places to go" or "Receipes to make"'
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
        :always-show-calendars ="false"
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
        value="2"
        class="slider"
        id="myRange"
        v-model="isPrivate"
        :class="{isPrivate:isPrivate==2}"
      />
      <div class="buttonDiv">
        <button :class="{ disable: false }" @click="editState=2">
          Delete
        </button>
          <button :class="{ disable: false }" @click="editState=3">
          Merge
        </button>
          <button :class="{ disable: false }">
          Archeive
        </button>
        <button :class="{ disable: false }" @click="editBoard">
          Done
        </button>
      </div>

    </div>
    <div class="editBoard" v-if="editState==2">
        <h3>Delete Board</h3>
        <h6>
        Once you delete a board and all of its Pins, you can't undo it.
        </h6>
        <button class="editButton" @click="editState=1">
            Cancel
        </button>
        <button class="editButton" @click="deleteBoard">
            Delete forever
        </button>
    </div>
    <div class="editBoard" v-if="editState==3">

    </div>

  </div>
</template>

<script>
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

export default {
  name: "EditPopup",
  data: function() {
    return {
      editState:1,
      minDate: new Date(),
      maxDate: null,
      dateRange: {
        startDate: new Date(),
        endDate: new Date()
      },
      checkOpen:false,
      isPrivate: 2
    };
  },
  components: {
    DateRangePicker,
  },
  methods: {
    editPopup(event) {
      if (event.target.id == "edit") {
        this.$store.commit("popUpsState/toggleEditBoardPopup");
      }
    },
    editBoard(){

    },
    deleteBoard(){
        this.$store.dispatch("boards/deleteBoard");
        this.$store.commit("popUpsState/toggleEditBoardPopup");
        this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
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
h3{
    width: 100%;
    text-align: center;
}
.editButton{
    position: relative;
    width: 100%;
    float: none;
}
.editButton:nth-child(3){
    margin: 10px 0;
    background-color:$lightPink;
    color: $darkBlue;
}
</style>
