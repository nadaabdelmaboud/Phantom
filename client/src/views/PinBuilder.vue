<template>
  <div class="row justify-content-center addPin m-0">
    <div class="col-sm-10 col-md-9 col-lg-7 pin">
      <div class="board">
        <div class="boardName">
          {{ board }}
          <button>Save</button>
        </div>
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
            dragging: dragover
          }"
          v-if="!imageFile"
          @click="$refs.fileInput.click()"
          @dragenter="dragover = true"
          @dragover.prevent="dragover = true"
          @drop.prevent="onFileDragged"
          @dragleave.prevent="dragover = false"
        >
          <i class="fa fa-arrow-circle-up"></i>
          <p>Drag and drop or click to upload</p>
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
        <button class="site" v-if="!imageFile">Save from site</button>
      </div>

      <div class="pinData addData">
        <input type="text" placeholder="Add your title" />
        <br />
        <i class="fa fa-user-circle"> Mostafa--</i>
        <br />
        <input type="text" placeholder="Tell everyone what your pin is about" />
        <br />
        <input type="text" placeholder="Add destination link" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../scss/Colors";

.addPin {
  background-color: white;
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
  //margin: 20px 0px;
  height: calc(100vh - 120px);
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
    left: 134px;
    width: 66px;
    height: 48px;
    margin-top: -12px;
    background-color: $darkBlue;
    color: $lightPink;
    border: none;
    border-radius: 0px 16px 16px 0px;
  }
}
.pinData {
  position: absolute;
  margin: 2.5%;
  background-color: $lightPink;
  top: 96px;
  border-radius: 16px;
  .site {
    position: absolute;
    top: 103%;
    width: 100%;
    height: 48px;
    background-color: $lightPink;
    color: $darkBlue;
    border: none;
    border-radius: 24px;
    transition: background-color 0.5s ease;
    &:hover {
      background-color: $lightPinkHover;
    }
  }
}
.addImg {
  width: 35%;
}
.imageInput {
  width: 100%;
  min-height: 420px;
  text-align: center;
  color: $darkBlue;
  cursor: pointer;
  i {
    position: absolute;
    top: 40%;
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
    top: 80%;
  }
  p:nth-child(2) {
    top: 50%;
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
.addData {
  width: 55%;
  left: 40%;
  padding: 10px;
  input {
    border: none;
    width: 90%;
    height: 48px;
    background-color: transparent;
    border-bottom: $darkBlue 2px solid;
    margin: 0px 5% 20px 5%;
  }
  i {
    font-size: 20px;
    margin: 5% 5% 20px 5%;
  }
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
</style>

<script>
import ml5 from "ml5";
// const classifier =ml5.imageClassifier(
//       this.imageModelURL + "model.json",
//       function() {
//         console.log("Model Loaded!");
//       }
//     );
export default {
  name: "PinBuilder",
  props: {
    boardName: {
      type: String,
      default: "Select"
    }
  },
  mounted() {
    this.board = this.boardName;
    this.classifier = ml5.imageClassifier(
      this.imageModelURL + "model.json",
      function() {
        console.log("Model Loaded!");
      }
    );
    //console.log(this.classifier)
  },
  data: function() {
    return {
      title: "",
      note: "",
      board: "",
      imageFile: null,
      dragover: false,
      imageModelURL:
        "https://teachablemachine.withgoogle.com/models/VEQ3gk-V4/",
      classifier: "",
      // To store the classification
      label: ""
    };
  },
  methods: {
    onFileDragged: function(event) {
      event.preventDefault();
      console.log(event.dataTransfer.files[0]);

      this.imageFile = event.dataTransfer.files[0];
      if (this.imageFile) {
        const reader = new FileReader();
        reader.addEventListener("load", function() {
          var img = document.getElementById("imgPreview");
          img.setAttribute("src", this.result);
          img.style.display = "block";
        });
        reader.readAsDataURL(this.imageFile);
      }
    },
    onFileSelected: function(event) {
      this.imageFile = event.target.files[0];
      console.log(this.imageFile);
      if (this.imageFile) {
        const reader = new FileReader();
        reader.addEventListener("load", function() {
          var img = document.getElementById("imgPreview");
          img.setAttribute("src", reader.result);
          img.style.display = "block";
          console.log("loaaaded");
        });

        reader.readAsDataURL(this.imageFile);
        setTimeout(() => {
          console.log(this.$refs.image);
          this.classifier.classify(this.$refs.image, this.gotResult);
        }, 1000);
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
      //  console.error("blabla");
      // Display error in the console
      if (error) {
        console.error("blabla", error);
      } else {
        // The results are in an array ordered by confidence.
        console.log(results);
      }
    }
  }
};
</script>
