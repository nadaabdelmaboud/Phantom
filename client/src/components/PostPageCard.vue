<template>
  <div class="postpagecard">
    <div class="container">
      <div class="box">
        <div class="imagebox">
          <img src="../assets/dress.jpg" alt="Post Image" />
        </div>
      </div>
      <div class="box">
        <div class="contentbox">
          <div id="navbar">
            <button class="save-post" id="saveImage">
              Save
            </button>
            <button class="share-icon" id="shareIcon">
              <i class="fa fa-upload" id="upload-icon"></i>
            </button>
            <button
              class="added-list"
              id="added-list"
              @click="showDropdownlist()"
            >
              <i class="fa fa-ellipsis-h" id="list-icon"></i>
            </button>
            <div class="dropdownlist" id="dropDownlist" v-if="show">
              <ul>
                <li>Download image</li>
                <li>Report Pin</li>
              </ul>
            </div>
          </div>
          <div class="secondsection">
            <div class="imageTitle">Awesome Dress</div>
            <span class="imagedescription"
              >beautiful blue dress beautiful blue dress beautiful blue dress
              beautiful blue dress beautiful blue dress beautiful blue dress
              beautiful blue dress beautiful blue dress beautiful blue dress
            </span>
            <div class="followuserbox">
              <div class="userimage">
                <img src="../assets/user.png" alt="User Image" />
              </div>
              <div class="userinfo">
                <h5 class="username">User</h5>
                <span class="followersnumber">15 followers</span>
              </div>
              <div class="followbutton">
                <button
                  v-if="followuser == false"
                  class="followUserbutton"
                  @click="followUnfollowUser()"
                >
                  Follow
                </button>
                <button
                  v-if="followuser == true"
                  class="followUserbutton"
                  @click="followUnfollowUser()"
                >
                  Following
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/_Colors";
@import "../scss/Mixins";
.postpagecard {
  margin: 30px;
}
.container {
  width: 100%;
  height: auto;
  box-shadow: 0 10px 10px 10px rgba(0, 0, 0, 0.06);
  border-radius: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-content: center;
}
.box {
  width: 50%;
  //margin:top right bottom left
  margin: 20px 20px 20px 5px;
  box-sizing: border-box;
}
img {
  width: 100%;
  height: auto;
  margin-top: 5px;
  background-size: cover;
  border-radius: 25px;
  object-fit: cover;
}
.contentbox {
  margin-left: 30px;
}
#navbar {
  overflow: hidden;
}
.save-post {
  background-color: $lightBlue;
  float: right;
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
  background-color: white;
  height: 40px;
  width: 40px;
  &:hover {
    background-color: $lightgrey;
  }
}
.added-list {
  @include circleButtons;
  background-color: white;
  height: 40px;
  width: 40px;
  &:hover {
    background-color: $lightgrey;
  }
}
#upload-icon,
#added-list {
  font-size: 22px;
}
.dropdownlist {
  position: absolute;
  width: 250px;
  height: 105px;
  background-color: $offWhite;
  z-index: 1;
  border-radius: 15px;
  padding: 15px;
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
      color: black;
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
.secondsection {
  margin-top: 20px;
  margin-right: 20px;
}
.imageTitle {
  font-size: 36px;
  font-weight: 700;
  color: black;
}
.imagedescription {
  font-size: 14px;
  text-align: left;
  font-weight: 400;
  color: black;
}
.followuserbox {
  display: flex;
  margin-top: 25px;
}
.followbutton {
  margin-left: auto;
}
.userimage {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.userinfo {
  margin: 10px;
}
.username {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
}
.followersnumber {
  font-size: 14px;
  font-weight: 400;
}
.followUserbutton {
  background-color: $lightBlue;
  color: white;
  border-radius: 500px;
  border-color: transparent;
  align-content: center;
  padding: 10px;
  &:hover {
    background-color: $darkBlue;
  }
}
button:focus {
  outline: 0 !important;
}
@media screen and (max-width: 950px) {
  .container {
    flex-flow: wrap;
    width: 95%;
  }
  .box {
    width: 100%;
    margin: 7px 7px 35px 7px;
  }
  .contentbox {
    margin-left: 0;
  }
}
</style>

<script>
export default {
  name: "postpagecard",
  data: function() {
    return {
      followuser: false,
      show: false
    };
  },
  methods: {
    followUnfollowUser() {
      this.followuser = !this.followuser;
    },
    showDropdownlist() {
      this.show = !this.show;
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
