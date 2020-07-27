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
        :always-show-calendars ="false"
        :linkedCalendars="true"
        @update="updateValues"
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
        @change="updateValues"
        :class="{isPrivate:isPrivate==2}"
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
      checkOpen:false,
      isPrivate: 2
    };
  },
  components: {
    DateRangePicker,
  },
  methods: {
    // classObject: function () {
    // return 
    //  },
    createBoardPopup(event) {
      if (event.target.id == "createBoard")
        this.$store.commit("popUpsState/toggleCreateBoardPopup");
    },
    createBoard() {
      if (this.boardName != "")
       { 
         let boardData={
           name:this.boardName,
           startDate:this.dateRange.startDate,
           endDate:this.dateRange.endDate,
           status:"public"
         }
         if(this.isPrivate==1)
           boardData.status="private"
         this.$store.dispatch("boards/createBoard", boardData);
         this.$store.commit("popUpsState/toggleCreateBoardPopup");
       }
    },
    updateValues(){
      console.log("iff pr",this.isPrivate)
    }
  },
  mounted(){
  }
};
</script>

<style lang="scss" scoped>
@import "../scss/Colors";

#createBoard {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 12;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  p {
    width: 100%;
    text-align: center;
    font-size: 30px;
  }
  .invalid {
    font-size: 12px;
    color: red;
    text-align: left;
  }
}
.boardData {
  margin: 90px auto;
  background-color: white;
  width: 450px;
  padding: 20px;
  border-radius: 32px;
  .inputFields {
    width: 100%;
    height: 48px;
    border: #d0d0d0 solid 1px;
    color: #767676;
    border-radius: 16px;
    padding: 16px 8px;
  }
  label {
    margin: 20px 40px 20px 0;
  }
  .noInput {
    border: red solid 1px;
  }
}
.slider {
  -webkit-appearance: none;
  width: 53px;
  height: 27px;
  border-radius: 13px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
}
.isPrivate{
   background:black;
}
.buttonDiv::after {
  content: "";
  clear: both;
  display: table;
}
button {
  float: right;
  position: relative;
  background-color: $darkBlue;
  color: $lightPink;
  height: 48px;
  border: none;
  padding: 10px 20px;
  border-radius: 32px;
  font-weight: 700;
}
.disable {
  cursor: default;
  background-color: darkgray;
  color: rgb(87, 87, 87);
}
ul{
  display: none
}

.vue-daterange-picker{
  width: 100%;
}
.vue-daterange-picker /deep/ .custumClass{
    padding: 12px;
    border: #d0d0d0 solid 1px;
    color: #767676;
    border-radius: 16px;
    height: 48px;
}
</style>
