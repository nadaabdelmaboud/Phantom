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
            <div class="imagedescription">
              beautiful blue dress beautiful blue dress beautiful blue dress
              beautiful blue dress beautiful blue dress beautiful blue dress
              beautiful blue dress beautiful blue dress beautiful blue dress
            </div>
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
            <div class="actionsbox">
              <li>
                <button
                  class="underlineLink"
                  id="photobutton"
                  @click="
                    addPhoto(), (showPhotos = true), (showComments = false)
                  "
                >
                  Photos
                </button>
              </li>
              <li>
                <button
                  class="underlineLink"
                  id="commentbutton"
                  @click="
                    addComment(), (showPhotos = false), (showComments = true)
                  "
                >
                  Comments
                </button>
              </li>
            </div>
            <div class="AddPhotos" v-if="showPhotos == true">
              <p>Tried this pin?</p>
              <div>
                Add a photo to show how it went
                <button class="addphotobutton">Add Photo</button>
              </div>
            </div>
            <div class="AddComments" v-if="showComments == true">
              <p>Share feedback, ask a question or give a high five</p>
              <div class="displaycomments">
                <div class="userimage">
                  <img src="../assets/user.png" alt="User Image" />
                </div>
                <div class="commentsfield">
                  <input type="text" placeholder="Add a Comment" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="toast" id="toastId">
      <img src="../assets/user.png" alt="User Image" class="toastimage" />
      <div class="userinfo">
        <div id="toastmessage">Now Following</div>
        <div class="toastusername">User</div>
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
  letter-spacing: 1px;
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
  letter-spacing: 1px;
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
button,
input:focus {
  outline: 0 !important;
}
.toastimage {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  margin-left: 10px;
}
#toastmessage {
  font-size: 14px;
  font-weight: 700px;
}
.toastusername {
  float: left;
  font-size: 14px;
  font-weight: 700;
}
.toast {
  display: flex;
  align-content: center;
  left: 40%;
  visibility: hidden;
  opacity: 0;
  position: fixed;
  bottom: 18px;
  margin: auto;
  min-width: 320px;
  height: 90px;
  background-color: rgb(19, 20, 20);
  padding: 10px;
  color: white;
  text-align: center;
  border-radius: 50px;
  z-index: 1500;
  box-shadow: 0 0 10 rgb(19, 20, 20);
  transition: 0.5s ease-in-out;
  font-size: 15px;
  .userinfo {
    margin-top: 13px;
  }
}
.toast--visible {
  visibility: visible;
  opacity: 1;
}
.actionsbox {
  margin-top: 25px;
}
li {
  display: inline;
}
li button {
  background: transparent;
  border: transparent;
  margin: 5px;
  color: $darkgrey;
  font-size: 17px;
  font-weight: 700;
  &:hover {
    color: black;
  }
  &:focus {
    color: black;
  }
}
.underlineLink::after {
  content: "";
  display: block;
  width: 0;
  height: 3px;
  background: black;
  transition: width 0.3s;
}
.underlineLink:hover::after {
  width: 100%;
  transition: width 0.3s;
}
.AddPhotos {
  margin: 12px;
  p {
    margin: 0;
    color: black;
  }
}
.addphotobutton {
  letter-spacing: 1px;
  background-color: $lightBlue;
  float: right;
  color: white;
  border-radius: 500px;
  border-color: transparent;
  align-content: center;
  padding: 10px;
  &:hover {
    background-color: $darkBlue;
  }
}
.AddComments {
  margin: 12px;
  p {
    font-size: 13px;
    color: black;
  }
}
.displaycomments {
  display: flex;
}
.commentsfield {
  margin-left: 20px;
  margin-top: 8px;
  width: 350px;
  height: 50px;
  border-radius: 40px;
  box-shadow: 0 2px 10px 10px rgba(0, 0, 0, 0.04);
  input {
    margin-left: 25px;
    border: none;
    background: none;
    outline: none;
    width: 280px;
    padding: 0;
    line-height: 50px;
  }
}

@media screen and (max-width: 993px) {
  .container {
    flex-flow: wrap;
    width: 85%;
  }
  .box {
    width: 100%;
    margin: 7px 7px 35px 7px;
  }
  .contentbox {
    margin-left: 0;
  }
}
@media screen and (max-width: 950px) {
  .toast {
    left: 30%;
  }
}
@media screen and (max-width: 720px) {
  .toast {
    left: 25%;
  }
}
@media screen and (max-width: 768px) {
  .commentsfield {
    width: 270px;
    input {
      width: 210px;
    }
  }
}
@media screen and (max-width: 580px) {
  .toast {
    left: 20%;
  }
}
@media screen and (max-width: 510px) {
  .toast {
    left: 17%;
  }
}
@media screen and (max-width: 480px) {
  .toast {
    left: 10%;
  }
}
@media screen and (max-width: 420px) {
  .commentsfield {
    input {
      width: 180px;
    }
  }
}
@media screen and (max-width: 360px) {
  .toast {
    left: 7%;
  }
  .AddComments {
    width: 290px;
  }
  .commentsfield {
    width: 200px;
    input {
      width: 150px;
    }
  }
}
</style>

<script>
export default {
  name: "postpagecard",
  data: function() {
    return {
      followuser: false,
      show: false,
      showPhotos: true,
      showComments: false
    };
  },
  methods: {
    showToast() {
      var mytoast = document.getElementById("toastId");
      clearTimeout(mytoast.hideTimeout);
      mytoast.className = "toast toast--visible";
      mytoast.hideTimeout = setTimeout(() => {
        mytoast.classList.remove("toast--visible");
      }, 2000);
    },
    followUnfollowUser() {
      this.followuser = !this.followuser;
      if (this.followuser == true) {
        this.showToast();
      }
    },
    showDropdownlist() {
      this.show = !this.show;
    },
    hideList(event) {
      if (event.target.id != ("list-icon" || "added-list")) {
        this.show = false;
      }
    },
    addPhoto() {
      //add Photos Here
    },
    addComment() {
      //add Comments Here
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
