<template>
  <div class="editPinContainer">
    <div class="content">
      <h5 class="title">
        Edit this Pin
      </h5>
      <div class="editContent">
        <div class="pinImage">
          <img :src="getImage(cardImage)" class="cardImg" alt="Card image" />
        </div>
        <div class="box">
          <div class="chooseBoard">
            <div class="boards">
              <input
                type="text"
                v-model="searchBoard"
                placeholder="Search board..."
                id="inputField"
              />
              <p id="boardTitle">All Boards</p>
              <div class="boardsList">
                <div v-for="(b, i) in userBoards" :key="i">
                  <ul>
                    <li
                      v-if="
                        b.board.name.search(new RegExp(searchBoard, 'i')) != -1
                      "
                      @click="chooseBoard(b.board.name, b.board._id, $event)"
                    >
                      {{ b.board.name }}
                      <i
                        class="fa fa-chevron-right arrow"
                        :class="{ rotate: showSections.includes(i) }"
                        id="openArrow"
                        v-if="b.board.sections.length"
                        @click="showSection(i)"
                      ></i>
                    </li>
                  </ul>
                  <p>{{ showSection[i] }}</p>
                  <div v-if="showSections.includes(i)" class="showSectionDiv">
                    <ul v-for="s in b.board.sections" :key="s._id">
                      <li
                        v-if="
                          s.sectionName.search(new RegExp(searchBoard, 'i')) !=
                            -1
                        "
                        @click="
                          chooseSection(s.sectionName, s._id, b.board._id)
                        "
                      >
                        {{ s.sectionName }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="createBoard" @click="createBoardPopup">
                <i class="fa fa-plus globalIcons"></i>
                <strong>Create Board</strong>
              </div>
            </div>
          </div>
          <div class="editCreatedPins" v-if="showCreatedPinInfo">
            <div class="editTitle">
              <h6>Title :</h6>
              <input
                type="text"
                placeholder="Change pin title..."
                id="inputFieldTitle"
              />
            </div>
            <div class="editDescribtion">
              <h6>Description :</h6>
              <textarea
                type="text"
                placeholder="Tell us about this pin..."
                id="inputFieldNote"
              ></textarea>
            </div>
          </div>
          <div class="editSavedPins" v-if="showSavedPinInfo">
            <h6>Note :</h6>
            <textarea
              type="text"
              placeholder="Write a note about this pin..."
              id="inputFieldNote"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="buttonsDiv">
        <div class="deletePin">
          <button class="optionBtns" id="cancelButton" @click="deletePin">
            Delete
          </button>
        </div>
        <div class="optionsDiv">
          <button class="optionBtns" id="cancelButton" @click="closePopUp">
            Cancel
          </button>
          <button class="optionBtns" id="saveButton" @click="editPin">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/Colors";
@import "../scss/Mixins";
.editPinContainer {
  @include popUpBackground;
}
.title {
  @include popUpTitle;
  margin-bottom: 30px;
}
.content {
  @include popUpContent;
  margin-top: 30px;
  padding-left: 1px;
  padding-right: 1px;
  width: 60%;
}
.editContent {
  display: flex;
  overflow-y: auto;
  height: 500px;
}
.box {
  display: block;
  width: 70%;
  margin-left: 17px;
}
.pinImage {
  width: 30%;
  display: flex;
  justify-content: center;
  height: auto;
  margin-top: 15px;
}
.cardImg {
  width: 80%;
  height: 300px;
  border-radius: 12px;
  box-shadow: 0 5px 10px 10px rgba(0, 0, 0, 0.06);
}
.chooseBoard {
  border-bottom: 1px solid rgba(148, 146, 146, 0.5);
  margin-right: 10px;
  input {
    width: 100%;
    padding: 5px;
    background-color: transparent;
    border: none;
    border-bottom: 2px solid black;
  }
}
#boardTitle {
  margin-top: 7px;
  font-weight: 700;
  font-size: 15px;
}
.createBoard {
  background-color: $lightBlue;
  width: 285px;
  height: 50px;
  border-radius: 25px;
  color: white;
  text-align: center;
  padding-top: 12px;
  margin-bottom: 15px;
  margin-top: 5px;
  transition: transform 0.5s;
  cursor: pointer;
  &:hover {
    background-color: $darkBlue;
    transform: scale(1.03);
  }
  i {
    padding-right: 7px;
  }
}
.boards {
  margin-right: 20px;
}
.boardsList {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 150px;
}
ul {
  margin: 0;
  padding: 0;
  list-style: none;
  li {
    position: relative;
    cursor: pointer;
    color: black;
    font-size: 15px;
    font-weight: 500;
    transition: transform 0.5s;
    padding: 20px;
    border-bottom: 1px solid rgba(53, 54, 54, 0.2);
    &:hover {
      background-color: rgba(196, 201, 201, 0.5);
      transform: scale(1.01);
    }
  }
  .arrow {
    position: absolute;
    right: 10px;
    top: 15px;
    font-size: 13px;
  }
  .rotate {
    transform: rotateZ(90deg);
  }
}
.editSavedPins,
.editCreatedPins,
.editDescribtion {
  margin-top: 10px;
}
#inputFieldNote {
  resize: none;
  width: 80%;
  height: 20%;
  padding: 10px;
  border: 2px solid rgba(161, 158, 158, 0.5);
  border-radius: 12px;
  min-height: 130px;
}
#inputFieldTitle {
  width: 80%;
  height: 15%;
  border: 2px solid rgba(161, 158, 158, 0.5);
  border-radius: 12px;
  padding: 10px;
}
.showSectionDiv {
  margin-left: 26px;
  margin-right: 26px;
}
.buttonsDiv {
  display: flex;
}
.deletePin {
  margin-right: auto;
  margin-left: 15px;
}
.optionsDiv {
  margin-left: auto;
  margin-right: 27px;
}
.optionBtns {
  margin-top: 20px;
  margin-left: 8px;
  letter-spacing: 1px;
  background-color: $lightBlue;
  color: white;
  font-weight: 700;
  border-radius: 500px;
  border-color: transparent;
  align-content: center;
  padding: 5px;
  width: 70px;
  &:hover {
    background-color: $darkBlue;
    opacity: 1;
  }
}
button:focus,
input:focus,
textarea:focus {
  outline: 0 !important;
}
@media screen and (max-width: 990px) {
  .content {
    width: 70%;
  }
}
@media screen and (max-width: 900px) {
  .editContent {
    flex-flow: wrap;
    justify-content: center;
  }
  .box {
    width: 80%;
  }
  #inputField {
    margin-top: 30px;
  }
  .pinImage {
    width: 50%;
  }
  .content {
    width: 75%;
  }
}
@media screen and (max-width: 650px) {
  .content {
    width: 85%;
  }
}
@media screen and (max-width: 550px) {
  .content {
    width: 95%;
  }
  .editContent {
    height: 400px;
  }
  .createBoard {
    width: 250px;
  }
}
@media screen and (max-width: 320px) {
  .editContent {
    height: 330px;
  }
  .createBoard {
    width: 220px;
  }
}
@media screen and (max-width: 280px) {
  .createBoard {
    width: 190px;
  }
  .optionsDiv {
    margin-right: 16px;
  }
  .deletePin {
    margin-left: 10px;
  }
}
</style>

<script>
import { default as getImage } from "../mixins/getImage";
import { mapState } from "vuex";
export default {
  name: "EditPin",
  data: function() {
    return {
      searchBoard: "",
      showSections: []
    };
  },
  mixins: [getImage],
  computed: {
    ...mapState({
      cardImage: state => state.homeCards.cardImageId,
      userBoards: state => state.boards.userBoards,
      showCreatedPinInfo: state => state.homeCards.showCreatedPinInfo,
      showSavedPinInfo: state => state.homeCards.showSavedPinInfo,
      pinType: state => state.homeCards.pinType
    })
  },
  mounted() {
    this.$store.dispatch("boards/userBoards");
  },
  methods: {
    closePopUp() {
      this.$store.commit("popUpsState/toggleEditPinPopUp");
    },
    createBoardPopup() {
      this.$store.commit("popUpsState/toggleCreateBoardPopup");
    },
    editPin() {},
    deletePin() {},
    chooseBoard(boardName, boardId, event) {
      const input = document.getElementById("inputField");
      input.value = boardName;
      let sectionId = "";
      if (event.target.id != "openArrow") {
        this.$store.commit("boards/chooseBoard", {
          boardName,
          boardId,
          sectionId
        });
      }
    },
    chooseSection(boardName, sectionId, boardId) {
      const input = document.getElementById("inputField");
      input.value = boardName;
      this.$store.commit("boards/chooseBoard", {
        boardName,
        boardId,
        sectionId
      });
    },
    showSection(i) {
      let index = this.showSections.indexOf(i);
      if (index == -1) this.showSections.push(i);
      else this.showSections.splice(index, 1);
    }
  }
};
</script>
