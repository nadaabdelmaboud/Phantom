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
      <input
        class="inputFields"
        type="date"
        placeholder='E.g "Places to go" or "Receipes to make"'
      />
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
export default {
  name: "createBoard",
  data: function() {
    return {
      boardName: "",
      noName: false
    };
  },
  methods: {
    createBoardPopup(event) {
      if (event.target.id == "createBoard")
        this.$store.commit("popUpsState/toggleCreateBoardPopup");
    },
    createBoard() {
      if (this.boardName != "")
        this.$store.dispatch("boards/createBoard", this.boardName);
      this.$store.commit("popUpsState/toggleCreateBoardPopup");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../scss/Colors";

#createBoard {
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  z-index: 12;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
</style>
