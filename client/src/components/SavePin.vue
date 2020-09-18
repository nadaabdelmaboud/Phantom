<template>
  <div class="savePin">
    <div class="content">
      <h5 class="title">Save Pin</h5>
      <div class="saveImage">
        <div class="pinImage">
          <img :src="getImage(cardImage)" class="cardImg" alt="Card image" />
        </div>
        <div class="chooseBoardDiv">
          <!-- <div class="boardName">
          {{ chosenBoardName }}
        </div> -->
          <div class="boards">
            <input
              type="text"
              v-model="searchBoard"
              placeholder="Search board..."
            />
            <p id="boardTitle">All Boards</p>
            <div class="boardsList">
              <div v-for="(b, i) in boards" :key="i">
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
                        s.sectionName.search(new RegExp(searchBoard, 'i')) != -1
                      "
                      @click="chooseSection(s.sectionName, s._id, b.board._id)"
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
      </div>
      <div class="optionsDiv">
        <button class="optionBtns" id="cancelButton" @click="closePopUp">
          Cancel
        </button>
        <button class="optionBtns" id="saveButton" @click="savePin">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/Colors";
@import "../scss/Mixins";
.savePin {
  @include popUpBackground;
}
.title {
  @include popUpTitle;
  margin-bottom: 30px;
}
.content {
  @include popUpContent;
  margin-top: 50px;
  padding-left: 1px;
  padding-right: 1px;
  width: 50%;
}
.saveImage {
  display: flex;
  overflow-y: auto;
  height: 460px;
}
.chooseBoardDiv {
  width: 55%;
  input {
    width: 100%;
    padding: 5px;
    background-color: transparent;
    border: none;
    border-bottom: 2px solid black;
  }
}
#boardTitle {
  margin-top: 10px;
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
  transition: transform 0.5s;
  cursor: pointer;
  &:hover {
    background-color: $darkBlue;
    transform: scale(1.05);
  }
  i {
    padding-right: 7px;
  }
}
.boardsList {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 330px;
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
}
.showSectionDiv {
  margin: 12px;
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
input:focus {
  outline: 0 !important;
}
.optionsDiv {
  display: flex;
  justify-content: flex-end;
  margin-right: 27px;
}
.cardImg {
  width: 80%;
  height: 450px;
  border-radius: 12px;
  box-shadow: 0 5px 10px 10px rgba(0, 0, 0, 0.06);
}
.pinImage {
  display: flex;
  justify-content: center;
  width: 40%;
  height: auto;
}
@media screen and (max-width: 1200px) {
  .content {
    width: 60%;
  }
}
@media screen and (max-width: 1000px) {
  .content {
    width: 65%;
  }
}
@media screen and (max-width: 900px) {
  .saveImage {
    flex-flow: wrap;
    justify-content: center;
    .pinImage {
      width: 100%;
    }
    .chooseBoardDiv {
      margin-top: 40px;
      width: 80%;
    }
  }
  .content {
    width: 60%;
  }
}
@media screen and (max-width: 600px) {
  .content {
    width: 85%;
  }
}
@media screen and (max-width: 412px) {
  .content {
    width: 95%;
    margin-top: 20px;
  }
  .saveImage {
    height: 430px;
  }
}
@media screen and (max-width: 360px) {
  .content {
    width: 95%;
    margin-top: 10px;
  }
  .saveImage {
    height: 430px;
  }
}
@media screen and (max-width: 320px) {
  .content {
    width: 95%;
    margin-top: 20px;
  }
  .title {
    margin-bottom: 15px;
  }
  .createBoard {
    width: 230px;
  }
  .saveImage {
    height: 350px;
  }
}
@media screen and (max-width: 320px) {
  .createBoard {
    width: 200px;
  }
}
</style>

<script>
import { default as getImage } from "../mixins/getImage";
import { mapGetters, mapState } from "vuex";
export default {
  name: "SavePin",
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
      CardId: state => state.homeCards.CardId
    }),
    ...mapGetters({
      boards: "boards/userBoards",
      chosenBoardName: "boards/chosenBoardName",
      chosenBoardId: "boards/chosenBoardId",
      chosenSectionId: "boards/chosenSectionId"
    })
  },
  methods: {
    closePopUp() {
      this.$store.commit("popUpsState/toggleSavePinPopUp");
    },
    savePin() {
      this.$store.dispatch("pins/savePost", this.CardId);
      this.$store.commit("popUpsState/toggleSavePinPopUp");
    },
    createBoardPopup() {
      this.$store.commit("popUpsState/toggleSavePinPopUp");
      this.$store.commit("popUpsState/toggleCreateBoardPopup");
      this.showBoard = false;
    },
    chooseBoard(boardName, boardId, event) {
      console.log("event", event.target.id);
      let sectionId = "";
      if (event.target.id != "openArrow") {
        this.showBoard = false;
        this.$store.commit("boards/chooseBoard", {
          boardName,
          boardId,
          sectionId
        });
      }
    },
    chooseSection(boardName, sectionId, boardId) {
      this.showBoard = false;
      //choosing section Name and setting it as display boardName and also choosing section id
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
    },
    createPin() {
      if (this.chosenBoardName == "Select") {
        this.showBoard = true;
      } else {
        if (this.title == "" || !this.imageFile) this.validate = true;
        else {
          console.log("nnn", this.width, "   ", this.height);
          let pin = {
            title: this.title,
            board: this.chosenBoardId,
            imageWidth: this.width,
            imageHeight: this.height,
            imageId: this.imageFile
          };
          if (this.chosenSectionId != "") {
            pin.section = this.chosenSectionId;
          }
          if (this.note != "") pin.note = this.note;
          this.$store.dispatch("pins/createPin", { pin, label: this.label });
        }
      }
    }
  }
};
</script>
