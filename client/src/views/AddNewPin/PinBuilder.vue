<template>
  <div class="row justify-content-center addPin m-0">
    <div class="col-sm-10 col-md-9 col-lg-7 pin">
      <div class="board">
        <div class="boardName" @click="showBoard = !showBoard">
          {{ chosenBoardName }}
        </div>
        <button v-if="!showBoard" @click="createPin">Save</button>
      </div>
      <input
        style="display:none"
        type="file"
        accept="image/bmp,image/gif,image/jpeg,image/png,image/tiff,image/webp"
        @change="onFileSelected"
        ref="fileInput"
      />
      <div class="pinData addImg">
        <div
          class="imageInput doubleBorder"
          :class="{
            dragging: dragover,
            noImage: validate && !imageFile
          }"
          v-if="!imageFile"
          @click="$refs.fileInput.click()"
          @dragenter="dragover = true"
          @dragover.prevent="dragover = true"
          @drop.prevent="onFileDragged"
          @dragleave.prevent="dragover = false"
        >
          <i v-if="validate && !imageFile" class="fa fa-exclamation-circle"></i>
          <i v-else class="fa fa-arrow-circle-up"></i>
          <p v-if="validate && !imageFile">
            Image is required to create a pin.
          </p>
          <p v-else>Drag and drop or click to upload</p>
          <p>Recommendation: Use high-quality .jpg files less than 32MB</p>
        </div>
        <img
          ref="image"
          style="display:none"
          id="imgPreview"
          src=""
          alt="uploaded img"
        />
        <i
          v-if="imageFile"
          class="fa fa-trash deleteicon"
          @click="unUpload"
        ></i>
      </div>

      <div class="pinData addData">
        <input type="text" placeholder="Add your title" v-model="title" />
        <p
          v-if="validate ? title == '' : false"
          style="color:rgb(230,0,35);margin-left:20px;"
        >
          Image is required to create a pin.
        </p>
        <br />
        <i class="fa fa-user-circle"> {{ user.userName }} --</i>
        <br />
        <input type="text" placeholder="Tell everyone what your pin is about" />
        <br />
        <input type="text" placeholder="Add destination link" />
      </div>

      <div class="boards" v-if="showBoard">
        <input type="text" v-model="searchBoard" placeholder="Search" />
        <p><strong>All Boards </strong></p>
        <div v-for="(b, i) in boards" :key="i">
          <ul>
            <li
              v-if="b.board.name.search(new RegExp(searchBoard, 'i')) != -1"
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
          <div v-if="showSections.includes(i)">
            <ul v-for="s in b.board.sections" :key="s._id">
              <li
                v-if="s.sectionName.search(new RegExp(searchBoard, 'i')) != -1"
                @click="chooseSection(s.sectionName, s._id, b.board._id)"
              >
                {{ s.sectionName }}
              </li>
            </ul>
          </div>
        </div>
        <div class="createBoard" @click="createBoardPopup">
          <i class="fa fa-plus globalIcons"></i>
          <strong>Create Board</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../../scss/Colors";
@import "../../scss/Mixins";

.addPin {
  background-color: white;
}
.boards {
  @include optionsList;
  right: 10px;
  top: 90px;
  max-height: 400px;
  overflow-y: auto;
  max-width: 95vw;
  .createBoard {
    background-color: $lightPink;
    cursor: pointer;
    height: 48px;
    padding: 12px 0;
    margin-bottom: 10px;
    border-radius: 16px;
    transition: background-color 0.5s ease;
    i {
      margin: 0 10px;
    }
  }
  .createBoard:hover {
    background-color: $lightPinkHover;
  }
}
@keyframes appear {
  from {
    margin: 30px 0px 0px 0px;
  }
  to {
    margin: 20px 0px;
  }
}
.pin {
  background-color: $offWhite;
  height: calc(100vh - 120px);
  min-height: 600px;
  border-radius: 16px;
  animation: appear 0.2s linear 1 both;
}

.board {
  cursor: pointer;
  .boardName {
    position: absolute;
    right: 30px;
    top: 20px;
    margin: 10px 0px;
    background-color: $lightPink;
    width: 200px;
    height: 48px;
    padding: 12px;
    border-radius: 16px;
  }
  button {
    position: absolute;
    right: 30px;
    top: 42px;
    width: 66px;
    height: 48px;
    margin-top: -12px;
    background-color: $darkBlue;
    color: $lightPink;
    border: none;
    border-radius: 0px 16px 16px 0px;
  }
  button:focus{
    outline: none;
  }
}
.pinData {
  position: absolute;
  margin: 2.5%;
  background-color: $lightPink;
  top: 96px;
  border-radius: 16px;
}
.addImg {
  width: 30%;
}
.imageInput {
  width: 100%;
  height: 80%;
  min-height: 420px;
  text-align: center;
  color: $darkBlue;
  cursor: pointer;
  i {
    position: absolute;
    bottom: 45%;
    right: calc(50% - 15px);
    text-align: center;
    font-size: 30px;
  }
  p {
    position: absolute;
    padding: 0px 30px;
    width: 100%;
    text-align: center;
  }
  p:nth-child(3) {
    bottom: 20px;
  }
  p:nth-child(2) {
    bottom: 50%;
  }
}
@media screen and (max-width: 650px) {
  .imageInput {
    p {
      font-size: 12px;
      font-weight: 600;
    }
    p:nth-child(3) {
      display: none;
    }
  }
}
.doubleBorder {
  position: relative;
}
.doubleBorder:before {
  background: none;
  border: 3px dashed $darkBlue;
  border-radius: 16px;
  content: "";
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
}
.dragging {
  border: 1px solid $darkBlue;
  border-radius: 16px;
  background-color: $lightBlue;
}
.noImage {
  border: 2px solid red;
  border-radius: 16px;
  background-color: rgba(230, 0, 35, 0.03);
  color: rgb(230, 0, 35);
  //height: 390px;
}
.addData {
  width: 45%;
  left: 40%;
  padding: 10px;
  min-height: 300px;
  input {
    border: none;
    width: 90%;
    height: 48px;
    background-color: transparent;
    border-bottom: $darkBlue 2px solid;
    margin: 0px 5% 20px 5%;
  }
  input:focus {
    outline: none;
  }
  i {
    font-size: 20px;
    margin: 5% 5% 20px 5%;
  }
}
.fa-user-circle {
  color: $darkBlue;
  font-size: 15px;
}
#imgPreview {
  width: 100%;
  border-radius: 16px;
}
.deleteicon {
  position: absolute;
  width: 38px;
  height: 38px;
  text-align: center;
  background-color: white;
  padding-top: 9px;
  font-size: 20px;
  top: 40%;
  border-radius: 50%;
  left: -7%;
}
.deleteicon:hover {
  transform: scale(1.2);
}
li {
  position: relative;
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
</style>

<script>
import ml5 from "ml5";
import { mapGetters, mapState } from "vuex";

export default {
  name: "PinBuilder",
  mounted() {
    this.$store.dispatch("boards/userBoards");
    this.classifier = ml5.imageClassifier(
      this.imageModelURL + "model.json",
      function() {
        console.log("Model Loaded!");
      }
    );
  },
  data: function() {
    return {
      title: "",
      note: "",
      searchBoard: "",
      showBoard: false,
      imageFile: null,
      width: "",
      height: "",
      dragover: false,
      imageModelURL:
        "https://teachablemachine.withgoogle.com/models/VEQ3gk-V4/",
      classifier: "",
      validate: false,
      // To store the classification
      label: "",
      showSections: []
    };
  },
  methods: {
    onFileDragged: function(event) {
      event.preventDefault();

      this.imageFile = event.dataTransfer.files[0];
      if (this.imageFile) {
        const reader = new FileReader();
        var image = new Image();
        reader.addEventListener("load", function() {
          var img = document.getElementById("imgPreview");
          img.setAttribute("src", this.result);
          img.style.display = "block";
          image.setAttribute("src", this.result);
        });
        reader.readAsDataURL(this.imageFile);
        setTimeout(() => {
          this.classifier.classify(this.$refs.image, this.gotResult);
          this.width = image.width;
          this.height = image.height;
        }, 500);
      }
    },
    onFileSelected: function(event) {
      this.imageFile = event.target.files[0];

      if (this.imageFile) {
        const reader = new FileReader();
        var image = new Image();
        reader.addEventListener("load", function() {
          var img = document.getElementById("imgPreview");
          img.setAttribute("src", this.result);
          img.style.display = "block";
          image.setAttribute("src", this.result);
        });
        reader.readAsDataURL(this.imageFile);

        setTimeout(() => {
          this.classifier.classify(this.$refs.image, this.gotResult);
          this.width = image.width;
          this.height = image.height;
        }, 500);
      }
    },
    unUpload: function() {
      this.imageFile = null;
      var img = document.getElementById("imgPreview");
      img.setAttribute("src", "");
      img.style.display = "none";
      this.dragover = false;
    },
    // A function to run when we get any errors and the results
    gotResult(error, results) {
      if (error) {
        console.error(error);
      } else {
        // The results are in an array ordered by confidence.
        this.label = results[0].label;
      }
    },
    createBoardPopup() {
      this.$store.commit("popUpsState/toggleCreateBoardPopup");
      this.showBoard = false;
    },
    chooseBoard(boardName, boardId, event) {
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
          let pin = {
            title: this.title,
            board: this.chosenBoardId,
            imageWidth: this.width,
            imageHeight: this.height,
            imageId: this.imageFile,
            topicName: this.label
          };
          if (this.chosenSectionId != "") {
            pin.section = this.chosenSectionId;
          }
          if (this.note != "") pin.note = this.note;
          this.$store.dispatch("pins/createPin", { pin, label: this.label });
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      boards: "boards/userBoards",
      chosenBoardName: "boards/chosenBoardName",
      chosenBoardId: "boards/chosenBoardId",
      chosenSectionId: "boards/chosenSectionId"
    }),
    ...mapState({
      user: state => state.user.userData
    })
  }
};
</script>
