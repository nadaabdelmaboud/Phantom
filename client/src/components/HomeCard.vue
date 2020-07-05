<template>
  <div class="card" id="homeCard">
    <img src="../assets/dress.jpg" class="card-img" alt="Card image" />
    <div class="card-img-overlay d-flex flex-column align-items-end">
      <button class="save-post" id="saveImage">Save</button>
      <div class="mt-auto">
        <button class="share-icon" id="shareIcon">
          <i class="fa fa-upload" id="upload-icon"></i>
        </button>
        <button class="added-list" id="added-list" @click="showDropdownlist()">
          <i class="fa fa-ellipsis-h" id="list-icon"></i>
        </button>
        <div class="dropdownlist" id="dropDownlist" v-if="show">
          <p class="title">This Pin is inspired by your recent activity</p>
          <hr />
          <ul>
            <li>Hide Pin</li>
            <li>Download image</li>
            <li>Report Pin</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/_Colors";
@import "../scss/Mixins";
.card {
  width: 252px;
  border-radius: 25px;
  margin-left: 15px;
  &:hover {
    .save-post,
    .share-icon,
    .added-list {
      display: inline;
    }
  }
}
.card-img {
  background-size: cover;
  border-radius: 25px;
  object-fit: cover;
}
.save-post {
  display: none;
  background-color: $lightBlue;
  color: white;
  border-radius: 500px;
  border-color: transparent;
  align-content: center;
  padding: 5px;
  width: 60px;
  &:hover {
    background-color: $darkBlue;
  }
}
button:focus {
  outline: 0 !important;
}
.share-icon {
  @include circleButtons;
  display: none;
}
.added-list {
  @include circleButtons;
  display: none;
}
.dropdownlist {
  position: absolute;
  width: 250px;
  background-color: $offWhite;
  z-index: 1;
  border-radius: 15px;
  padding: 15px;
  left: 235px;
  bottom: -25px;
  .title {
    font-size: 14px;
    font-weight: 400;
  }
  ul {
    position: relative;
    margin-left: 0%;
    padding: 0;
    &:hover li {
      opacity: 0.2;
    }
    li {
      list-style: none;
      font-weight: bold;
      font-size: 12px;
      padding: 10px;
      width: 100%;
      transition: transform 0.5s;
      &:hover {
        transform: scale(1.1);
        z-index: 100;
        background: $lightgrey;
        opacity: 1;
      }
    }
  }
}
</style>
<script>
export default {
  data: function() {
    return {
      show: false
    };
  },
  methods: {
    showDropdownlist() {
      var listIcon = document.getElementById("added-list");
      var savePost = document.getElementById("saveImage");
      var shareIcon = document.getElementById("shareIcon");
      var isShown = this.show;
      window.Element.show = false;
      this.show = !isShown;
      if (this.show == true) {
        listIcon.style["display"] = "inline";
        savePost.style["display"] = "inline";
        shareIcon.style["display"] = "inline";
      } else {
        listIcon.style = "default";
        savePost.style = "default";
        shareIcon.style = "default";
      }
      // Remaining
      // shift list 180 degree for the most right card in the page
    },
    defaultStyle() {
      var listIcon = document.getElementById("added-list");
      var savePost = document.getElementById("saveImage");
      var shareIcon = document.getElementById("shareIcon");
      listIcon.style = "default";
      savePost.style = "default";
      shareIcon.style = "default";
    },
    hideList(event) {
      if (event.target.id != ("list-icon" || "added-list")) {
        this.show = false;
        this.defaultStyle();
      }
    }
  },
  created: function() {
    window.addEventListener("click", this.hideList);
  },
  beforeDestroy: function() {
    window.removeEventListener("click", this.hideList);
  }
};
</script>
