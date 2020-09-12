<template>
  <div class="postpagecard">
    <div class="container">
      <div class="box">
        <div class="imagebox">
          <img :src="getImage(this.postImage)" alt="Post Image" />
        </div>
      </div>
      <div class="box">
        <div class="contentbox">
          <div id="navbar">
            <button class="save-post" id="saveImage">
              Save
            </button>
            <button class="heart-icon" id="heartIcon" @click="showReactsList">
              <i class="fa fa-heart" id="heart-icon"></i>
            </button>
            <!-- //////////////////////////////// -->
            <div class="reactsList" id="reactsList" v-if="showReacts">
              <ul>
                <li>
                  <img
                    src="../assets/Haha.gif"
                    alt="reactHaha"
                    @click="reactHaha"
                  />
                </li>
                <li>
                  <img
                    src="../assets/Wow1.gif"
                    alt="reactWow"
                    @click="reactWow"
                  />
                </li>
                <li>
                  <img
                    src="../assets/Love2.gif"
                    alt="reactLove"
                    @click="reactLove"
                  />
                </li>
                <li>
                  <img
                    src="../assets/GoodIdea1.gif"
                    alt="reactGoodIdea"
                    @click="reactGoodIdea"
                  />
                </li>
                <li>
                  <img
                    src="../assets/Thanks.gif"
                    alt="reactThanks"
                    @click="reactThanks"
                  />
                </li>
              </ul>
            </div>
            <!-- //////////////////////// -->
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
            <div class="imageTitle">{{ this.postTitle }}</div>
            <div class="imagedescription">
              {{ this.postDescribtion }}
            </div>
            <div class="followuserbox">
              <div class="userimage">
                <img :src="getImage(this.userImageId)" alt="User Image" />
              </div>
              <div class="userinfo">
                <h5 class="username">
                  {{ this.userFirstName }} {{ this.userLastName }}
                </h5>
                <span class="followersnumber"
                  >{{ this.numberofFollowers }} followers</span
                >
              </div>
              <div class="followbutton">
                <button
                  v-if="
                    (this.isFollowed == false && firstTime == true) ||
                      (followPinCreatorBtn == false && firstTime == false)
                  "
                  class="followUserbutton"
                  @click="followUnfollowUser()"
                >
                  Follow
                </button>
                <button
                  v-if="
                    (this.isFollowed == true && firstTime == true) ||
                      (followPinCreatorBtn == true && firstTime == false)
                  "
                  class="followUserbutton"
                  @click="followUnfollowUser()"
                >
                  Following
                </button>
              </div>
            </div>
            <div class="actionsbox">
              <li>
                <button class="underlineLink" id="commentbutton">
                  Comments
                </button>
              </li>
            </div>
            <div class="AddComments">
              <p>Share feedback, ask a question or give a high five</p>
              <div class="displaycomments">
                <div class="userimage">
                  <img :src="getImage(this.userImageId)" alt="User Image" />
                </div>
                <div class="commentsfield">
                  <input
                    type="text"
                    placeholder="Add a Comment"
                    id="inputfield-comments"
                    @click="inputFieldIsActive()"
                  />
                </div>
              </div>
              <div class="finishingComment" v-if="typingComment == true">
                <button class="save-comment" @click="addComment()">Done</button>
                <button class="cancel-comment" @click="cancelComment()">
                  Cancel
                </button>
              </div>
              <div id="postComments"></div>
            </div>
            <div class="reactsSection">
              <p>
                {{ this.numReactHaha }}
                <img
                  src="../assets/Haha.png"
                  alt="reactHaha"
                  id="reactImages"
                />
              </p>
              <p>
                {{ this.numReactWow }}
                <img src="../assets/Wow.png" alt="reactWow" id="reactImages" />
              </p>
              <p>
                {{ this.numReactLove }}
                <img
                  src="../assets/Love.jpg"
                  alt="reactLove"
                  id="reactImages"
                />
              </p>
              <p>
                {{ this.numReactGoodIdea }}
                <img
                  src="../assets/GoodIdea.png"
                  alt="reactGoodIdea"
                  id="reactImages"
                />
              </p>
              <p>
                {{ this.numReactThanks }}
                <img
                  src="../assets/Thanks.jpg"
                  alt="reactThanks"
                  id="reactImages"
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="toast" id="toastId">
      <img
        :src="getImage(this.userImageId)"
        alt="User Image"
        class="toastimage"
      />
      <div class="userinfo">
        <div id="toastmessage">Now Following</div>
        <div class="toastusername">
          {{ this.userFirstName }} {{ this.userLastName }}
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
  margin: 20px 20px 40px 5px;
  box-sizing: border-box;
  position: relative;
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
.save-post,
.save-comment,
.cancel-comment {
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

.cancel-comment {
  background-color: grey;
  width: 70px;
}

.cancel-comment,
.save-comment {
  margin: 15px 5px 5px 5px;
}

.heart-icon {
  @include circleButtons;
  background: transparent;
  height: 40px;
  width: 40px;
  &:hover {
    background-color: $lightgrey;
  }
}
.reactsList {
  position: absolute;
  width: 330px;
  height: 80px;
  background-color: $offWhite;
  z-index: 1;
  border-radius: 50px;
  padding: 15px;
  box-shadow: 0 5px 10px 10px rgba(0, 0, 0, 0.06);
  ul {
    position: relative;
    margin: 0;
    padding: 0;
  }
  li {
    display: inline;
    list-style: none;
    font-size: 12px;
    padding: 5px;
  }
  img {
    margin-top: 0;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.5s;
    &:hover {
      transform: scale(1.4);
      z-index: 100;
    }
  }
}
.added-list {
  @include circleButtons;
  background: transparent;
  height: 40px;
  width: 40px;
  &:hover {
    background-color: $lightgrey;
  }
}
#heart-icon,
#added-list {
  font-size: 22px;
}
#heart-icon {
  padding-top: 5px;
}
.dropdownlist {
  position: absolute;
  width: 250px;
  height: 105px;
  background-color: $offWhite;
  z-index: 1;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 5px 10px 10px rgba(0, 0, 0, 0.06);
  ul {
    position: relative;
    margin-left: 0%;
    padding: 0;
    &:hover li {
      opacity: 0.2;
    }
    li {
      display: block;
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

.AddComments {
  margin: 12px;
  margin-bottom: 35px;
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

#postComments {
  color: red;
}

.reactsSection {
  display: flex;
  position: absolute;
  bottom: 0;
  p {
    margin-bottom: 0;
  }
}
#reactImages {
  margin-top: 0;
  margin-right: 5px;
  margin-left: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

@media screen and (max-width: 1540px) {
  .container {
    width: 1000px;
  }
}

@media screen and (max-width: 993px) {
  .container {
    flex-flow: wrap;
    width: 85%;
  }
  .box {
    width: 100%;
    margin: 7px 7px 30px 7px;
  }
  .contentbox {
    margin-left: 0;
  }
  .AddComments {
    margin-bottom: 55px;
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
  .reactsList {
    width: 250px;
    height: 60px;
    img {
      width: 30px;
      height: 30px;
    }
  }
}
</style>

<script>
import { mapGetters } from "vuex";
import { default as getImage } from "../mixins/getImage";
import io from "socket.io-client";
export default {
  name: "postpagecard",
  data: function() {
    return {
      firstTime: true,
      followPinCreatorBtn: false,
      show: false,
      typingComment: false,
      showReacts: false,
      reactType: ""
    };
  },
  mixins: [getImage],
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
      if (this.firstTime == true) this.followPinCreatorBtn = this.isFollowed;
      if (this.followPinCreatorBtn == false) {
        this.showToast();
        this.$store.dispatch("postPage/followPinCreator", this.pinCreatorId);
      } else {
        this.$store.dispatch("postPage/unFollowPinCreator", this.pinCreatorId);
      }
      this.firstTime = false;
      this.followPinCreatorBtn = !this.followPinCreatorBtn;
    },
    showDropdownlist() {
      this.show = !this.show;
    },
    showReactsList() {
      const heart = document.getElementById("heart-icon");
      console.log("heartColor", heart.style.color);
      if (heart.style.color !== "black") {
        heart.style.color = "black";
        this.reactType = "none";
        this.$store.dispatch("postPage/reactPin", {
          pinId: this.pinId,
          reactType: this.reactType
        });
      } else {
        this.showReacts = !this.showReacts;
      }
    },
    reactHaha() {
      this.reactType = "Haha";
      this.$store.dispatch("postPage/reactPin", {
        pinId: this.pinId,
        reactType: this.reactType
      });
      document.getElementById("heart-icon").style.color = "yellow";
      this.showReacts = !this.showReacts;
    },
    reactWow() {
      this.reactType = "Wow";
      this.$store.dispatch("postPage/reactPin", {
        pinId: this.pinId,
        reactType: this.reactType
      });
      document.getElementById("heart-icon").style.color = "green";
      this.showReacts = !this.showReacts;
    },
    reactLove() {
      this.reactType = "Love";
      this.$store.dispatch("postPage/reactPin", {
        pinId: this.pinId,
        reactType: this.reactType
      });
      document.getElementById("heart-icon").style.color = "red";
      this.showReacts = !this.showReacts;
    },
    reactGoodIdea() {
      this.reactType = "Good idea";
      this.$store.dispatch("postPage/reactPin", {
        pinId: this.pinId,
        reactType: this.reactType
      });
      document.getElementById("heart-icon").style.color = "blue";
      this.showReacts = !this.showReacts;
    },
    reactThanks() {
      this.reactType = "Thanks";
      this.$store.dispatch("postPage/reactPin", {
        pinId: this.pinId,
        reactType: this.reactType
      });
      document.getElementById("heart-icon").style.color = "pink";
      this.showReacts = !this.showReacts;
    },
    hideList(event) {
      if (event.target.id != ("list-icon" || "added-list")) {
        this.show = false;
      }
    },
    inputFieldIsActive() {
      this.typingComment = true;
    },
    cancelComment() {
      this.typingComment = false;
      var inputField = document.getElementById("inputfield-comments");
      inputField.value = "";
    },
    addComment() {
      const socket = io.connect("http://localhost:3000");
      var inputField = document.getElementById("inputfield-comments");
      var comments = document.getElementById("postComments");
      let token = localStorage.getItem("userToken");
      socket.emit("comment", {
        commentText: inputField.value,
        pinId: this.$route.params.postPageId,
        token: token,
        text: inputField.value
      });
      console.log("NIHALLLLLLLLLLLLLLLLLLLLLLLLLLLL", token);
      socket.on("sendComment", function(data) {
        console.log("NIHAAAAAAAAAAAAAAAAAL");
        comments.innerHTML += "<p>" + data.commentText + "</p>";
      });
      this.$store.dispatch(
        "postPage/postPageAddedComments",
        this.$route.params.postPageId
      );
    }
  },
  created: function() {
    window.addEventListener("click", this.hideList);
  },
  beforeDestroy: function() {
    window.removeEventListener("click", this.hideList);
  },
  mounted() {
    const heart = document.getElementById("heart-icon");
    heart.style.color = "black";
    setTimeout(() => {
      console.log("this.reactThisPin", this.reactThisPin);
      if (this.reactThisPin == "none") heart.style.color = "black";
      else if (this.reactThisPin == "Haha") heart.style.color = "yellow";
      else if (this.reactThisPin == "Wow") heart.style.color = "green";
      else if (this.reactThisPin == "Love") heart.style.color = "red";
      else if (this.reactThisPin == "Good Idea") heart.style.color = "blue";
      else if (this.reactThisPin == "Thanks") heart.style.color = "pink";
    }, 1000);
  },
  computed: {
    ...mapGetters({
      postImage: "homeCards/postImage",
      userImageId: "homeCards/userImageId",
      postTitle: "homeCards/postTitle",
      postDescribtion: "homeCards/postDescribtion",
      userFirstName: "homeCards/userFirstName",
      userLastName: "homeCards/userLastName",
      numberofFollowers: "homeCards/numberofFollowers",
      pinCreatorId: "homeCards/pinCreatorId",
      isFollowed: "phantomUser/isFollowed",
      pinId: "homeCards/pinId",
      numReactHaha: "homeCards/numReactHaha",
      numReactWow: "homeCards/numReactWow",
      numReactLove: "homeCards/numReactLove",
      numReactGoodIdea: "homeCards/numReactGoodIdea",
      numReactThanks: "homeCards/numReactThanks",
      reactThisPin: "homeCards/reactThisPin"
    })
  }
};
</script>
