<template>
  <div class="postpagecard">
    <div class="container">
      <div class="box">
        <Loading :loading="postPageLoading" v-if="postPageLoading" />
        <div class="imagebox" v-if="!postPageLoading">
          <img :src="getImage(this.postImage)" alt="Post Image" />
        </div>
      </div>
      <div class="box">
        <Loading :loading="postPageLoading" v-if="postPageLoading" />
        <div class="contentbox" v-if="!postPageLoading">
          <div id="navbar">
            <button class="save-post" id="saveImage" @click="savePin">
              Save
            </button>
            <button
              class="edit-icon"
              id="editIcon"
              v-if="pinType == 'saved' || pinType == 'creator'"
              @click="editPin"
            >
              <i class="fa fa-pencil" id="edit-icon"></i>
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
                    src="../assets/Wow.gif"
                    alt="reactWow"
                    @click="reactWow"
                  />
                </li>
                <li>
                  <img
                    src="../assets/Love.gif"
                    alt="reactLove"
                    @click="reactLove"
                  />
                </li>
                <li>
                  <img
                    src="../assets/GoodIdea.gif"
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
                <li @click="downloadImage">Download image</li>
                <li @click="showReportPin">Report Pin</li>
              </ul>
            </div>
          </div>
          <div class="secondsection">
            <div class="imageTitle">{{ postTitle }}</div>
            <div class="imagedescription">
              {{ postDescribtion }}
            </div>
            <div class="followuserbox">
              <div class="userimage">
                <img
                  :src="
                    getImage(this.userImageId, this.google, this.googleImage)
                  "
                  alt="User Image"
                />
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
                    ((this.isFollowed == false && firstTime == true) ||
                      (followPinCreatorBtn == false && firstTime == false)) &&
                      pinType != 'creator'
                  "
                  class="followUserbutton"
                  @click="followUnfollowUser()"
                >
                  Follow
                </button>
                <button
                  v-if="
                    ((this.isFollowed == true && firstTime == true) ||
                      (followPinCreatorBtn == true && firstTime == false)) &&
                      pinType != 'creator'
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
                <button
                  class="underlineLink"
                  id="commentbutton"
                  @click="showCommentsList"
                >
                  {{ this.pinComments.length }} Comments
                </button>
              </li>
            </div>
            <div class="AddComments">
              <p>Share feedback, ask a question or give a high five</p>
              <!-- ////////////////////////////////////// -->
              <ul
                id="commentsList"
                v-if="this.pinComments.length != 0 && this.showcomments == true"
              >
                <li
                  v-for="pinComment in pinComments"
                  :key="pinComment.comment.id"
                >
                  <div class="liDiv">
                    <div class="displaycomments">
                      <div class="userimage">
                        <img
                          :src="
                            getImage(
                              pinComment.comment.commenterImage,
                              pinComment.comment.google,
                              pinComment.comment.googleImage
                            )
                          "
                          alt="User Image"
                        />
                      </div>
                      <div class="previousCommentsfield">
                        <h6 class="commentCreatorName">
                          {{ pinComment.comment.commenterName }}
                          <span>
                            {{ pinComment.comment.date }}
                          </span>
                        </h6>
                        <span id="commentTextStyle">{{
                          pinComment.comment.commentText
                        }}</span>
                        <hr id="commentsSeparator" />
                        <p>
                          <i
                            class="fa fa-thumbs-up"
                            style="color:blue"
                            v-if="pinComment.comment.isLiked == true"
                            v-bind:id="pinComment.comment.id"
                            @click="userLikeComment(pinComment.comment.id)"
                          ></i>
                          <i
                            class="fa fa-thumbs-up"
                            style="color:grey"
                            v-if="pinComment.comment.isLiked == false"
                            v-bind:id="pinComment.comment.id"
                            @click="userLikeComment(pinComment.comment.id)"
                          ></i>
                          <i
                            class="fa fa-reply"
                            id="replyIcon"
                            @click="
                              showCommentReplies(
                                pinComment.comment.id + 0,
                                pinComment.comment.id + 2
                              )
                            "
                          ></i>
                          {{ pinComment.comment.likes.counts }} likes
                        </p>
                      </div>
                    </div>
                    <!-- /////////////////////////////////Replies//////////////// -->
                    <div
                      class="containReplies"
                      v-bind:id="pinComment.comment.id + 0"
                    >
                      <div
                        class="displayreplies"
                        v-for="replies in pinComment.replies"
                        :key="replies.id"
                      >
                        <div class="userimage">
                          <img
                            :src="
                              getImage(
                                replies.replierImage,
                                replies.google,
                                replies.googleImage
                              )
                            "
                            alt="User Image"
                          />
                        </div>
                        <div class="previousrepliesfield">
                          <h6 class="commentCreatorName">
                            {{ replies.replierName }}
                            <span>
                              {{ replies.date }}
                            </span>
                          </h6>
                          <span id="replyTextStyle">{{
                            replies.replyText
                          }}</span>
                          <hr id="commentsSeparator" />
                          <p>
                            <i
                              class="fa fa-thumbs-up"
                              style="color:blue"
                              v-if="replies.isLiked == true"
                              v-bind:id="replies.id"
                              @click="
                                userLikeReply(replies.id, pinComment.comment.id)
                              "
                            ></i>
                            <i
                              class="fa fa-thumbs-up"
                              style="color:grey"
                              v-if="replies.isLiked == false"
                              v-bind:id="replies.id"
                              @click="
                                userLikeReply(replies.id, pinComment.comment.id)
                              "
                            ></i>
                            {{ replies.likes.counts }} likes
                          </p>
                        </div>
                      </div>
                      <div class="createReply">
                        <div class="userimage">
                          <img
                            v-if="showGoogleImage"
                            :src="
                              getImage(
                                userData.profileImage,
                                userData.google,
                                userData.googleImage
                              )
                            "
                            alt="User Image"
                          />
                        </div>
                        <div class="repliesField">
                          <input
                            type="text"
                            placeholder="Add a Reply..."
                            v-bind:id="pinComment.comment.id + 1"
                            @click="
                              inputFieldReplyIsActive(pinComment.comment.id + 2)
                            "
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      class="finishReply"
                      v-bind:id="pinComment.comment.id + 2"
                    >
                      <button
                        class="save-reply"
                        @click="
                          addReply(
                            pinComment.comment.id,
                            pinComment.comment.id + 1
                          )
                        "
                      >
                        Done
                      </button>
                      <button
                        class="cancel-reply"
                        @click="
                          cancelReply(
                            pinComment.comment.id + 1,
                            pinComment.comment.id + 2
                          )
                        "
                      >
                        Cancel
                      </button>
                    </div>
                    <!-- ////////////////////////////////////// -->
                  </div>
                </li>
              </ul>
              <div class="displaycomments">
                <div class="userimage">
                  <img
                    v-if="showGoogleImage"
                    :src="
                      getImage(
                        userData.profileImage,
                        userData.google,
                        userData.googleImage
                      )
                    "
                    alt="User Image"
                  />
                </div>
                <div class="commentsfield">
                  <input
                    type="text"
                    placeholder="Add a Comment..."
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
            </div>
            <div class="reactsSection">
              <p v-if="this.numReactHaha != 0">
                {{ this.numReactHaha }}
                <img
                  src="../assets/Haha.png"
                  alt="reactHaha"
                  id="reactImages"
                />
              </p>
              <p v-if="this.numReactWow != 0">
                {{ this.numReactWow }}
                <img src="../assets/Wow.png" alt="reactWow" id="reactImages" />
              </p>
              <p v-if="this.numReactLove != 0">
                {{ this.numReactLove }}
                <img
                  src="../assets/Love.jpg"
                  alt="reactLove"
                  id="reactImages"
                />
              </p>
              <p v-if="this.numReactGoodIdea != 0">
                {{ this.numReactGoodIdea }}
                <img
                  src="../assets/GoodIdea.png"
                  alt="reactGoodIdea"
                  id="reactImages"
                />
              </p>
              <p v-if="this.numReactThanks != 0">
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
.save-reply,
.cancel-comment,
.cancel-reply {
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
.cancel-comment,
.cancel-reply {
  background-color: grey;
  width: 70px;
}
.cancel-comment,
.save-comment,
.save-reply,
.cancel-reply {
  margin: 15px 5px 5px 5px;
}
.save-reply,
.cancel-reply {
  font-size: 16px;
  font-weight: 400;
  &:hover {
    color: white;
  }
  &:focus {
    color: white;
  }
}
#edit-icon {
  color: black;
  font-size: 20px;
}
.edit-icon {
  @include circleButtons;
  background: transparent;
  height: 40px;
  width: 40px;
  &:hover {
    background-color: $lightgrey;
  }
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
      cursor: pointer;
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
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
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
  margin-top: 25px;
}
.createReply {
  display: flex;
  margin-left: 20%;
}
.finishReply {
  margin-bottom: 70px;
  display: none;
}
.containReplies {
  display: none;
}
.displayreplies {
  display: flex;
  margin-left: 20%;
}
.commentsfield,
.repliesField,
.previousCommentsfield,
.previousrepliesfield {
  margin-left: 15px;
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
.repliesField {
  width: 260px;
  input {
    width: 220px;
  }
}
#commentsList,
#repliesList {
  list-style: none;
  margin: 0;
  padding: 0;
  p {
    margin: 0;
    padding: 5px;
    padding-left: 0;
  }
  h6 {
    margin: 0;
  }
}
.previousCommentsfield {
  height: auto;
  box-shadow: none;
  border: 1px solid rgba(189, 186, 186, 0.5);
  border-radius: 15px;
  padding: 10px;
  span {
    color: rgb(85, 84, 84);
    font-size: 13px;
  }
}
.previousrepliesfield {
  width: 245px;
  height: auto;
  box-shadow: none;
  border: 1px solid rgba(189, 186, 186, 0.5);
  border-radius: 15px;
  padding: 10px;
  span {
    color: rgb(85, 84, 84);
    font-size: 13px;
  }
}
#commentsSeparator {
  color: rgba(156, 151, 151, 0.5);
  margin: 0;
  margin-top: 10px;
  padding: 0;
}
#commentTextStyle,
#replyTextStyle {
  font-size: 13px;
  color: black;
  display: block;
  word-wrap: break-word;
}
#replyTextStyle {
  width: 225px;
}
.liDiv {
  display: block;
}
#replyIcon,
#likeIcon {
  color: grey;
  font-size: 13px;
  padding: 7px;
  padding-top: 11px;
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
  .displayreplies,
  .createReply {
    margin-left: 10%;
  }
}
@media screen and (max-width: 580px) {
  .toast {
    left: 20%;
  }
  .displayreplies,
  .createReply {
    margin-left: 8%;
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
    width: 270px;
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
  .previousrepliesfield {
    width: 180px;
  }
  #replyTextStyle {
    width: 160px;
  }
  .repliesField {
    width: 220px;
    input {
      width: 150px;
    }
  }
  .createReply {
    margin-left: 6%;
  }
}
</style>

<script>
import { mapGetters, mapState } from "vuex";
import { default as getImage } from "../mixins/getImage";
import Loading from "../components/GeneralComponents/Loading";
import io from "socket.io-client";
export default {
  name: "postpagecard",
  components: {
    Loading
  },
  data: function() {
    return {
      firstTime: true,
      followPinCreatorBtn: false,
      show: false,
      typingComment: false,
      showReacts: false,
      reactType: "",
      showcomments: false,
      index: 0,
      showGoogleImage: false,
      socket: ""
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
        if (heart.style.color === "yellow")
          this.$store.commit(
            "homeCards/setNumReactHaha",
            this.numReactHaha - 1
          );
        else if (heart.style.color === "green")
          this.$store.commit("homeCards/setNumReactWow", this.numReactWow - 1);
        else if (heart.style.color === "red")
          this.$store.commit(
            "homeCards/setNumReactLove",
            this.numReactLove - 1
          );
        else if (heart.style.color === "blue")
          this.$store.commit(
            "homeCards/setNumReactGoodIdea",
            this.numReactGoodIdea - 1
          );
        else if (heart.style.color === "pink")
          this.$store.commit(
            "homeCards/setNumReactThanks",
            this.numReactThanks - 1
          );
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
      this.$store.commit("homeCards/setNumReactHaha", this.numReactHaha + 1);
    },
    reactWow() {
      this.reactType = "Wow";
      this.$store.dispatch("postPage/reactPin", {
        pinId: this.pinId,
        reactType: this.reactType
      });
      document.getElementById("heart-icon").style.color = "green";
      this.showReacts = !this.showReacts;
      this.$store.commit("homeCards/setNumReactWow", this.numReactWow + 1);
    },
    reactLove() {
      this.reactType = "Love";
      this.$store.dispatch("postPage/reactPin", {
        pinId: this.pinId,
        reactType: this.reactType
      });
      document.getElementById("heart-icon").style.color = "red";
      this.showReacts = !this.showReacts;
      this.$store.commit("homeCards/setNumReactLove", this.numReactLove + 1);
    },
    reactGoodIdea() {
      this.reactType = "Good idea";
      this.$store.dispatch("postPage/reactPin", {
        pinId: this.pinId,
        reactType: this.reactType
      });
      document.getElementById("heart-icon").style.color = "blue";
      this.showReacts = !this.showReacts;
      this.$store.commit(
        "homeCards/setNumReactGoodIdea",
        this.numReactGoodIdea + 1
      );
    },
    reactThanks() {
      this.reactType = "Thanks";
      this.$store.dispatch("postPage/reactPin", {
        pinId: this.pinId,
        reactType: this.reactType
      });
      document.getElementById("heart-icon").style.color = "pink";
      this.showReacts = !this.showReacts;
      this.$store.commit(
        "homeCards/setNumReactThanks",
        this.numReactThanks + 1
      );
    },
    hideList(event) {
      if (event.target.id != ("list-icon" || "added-list")) {
        this.show = false;
      }
    },
    inputFieldIsActive() {
      this.typingComment = true;
    },
    inputFieldReplyIsActive(id) {
      const typingReply = document.getElementById(id);
      typingReply.style.display = "block";
    },
    cancelComment() {
      this.typingComment = false;
      var inputField = document.getElementById("inputfield-comments");
      inputField.value = "";
    },
    cancelReply(inputfieldid, divid) {
      const typingReply = document.getElementById(divid);
      typingReply.style.display = "none";
      var inputField = document.getElementById(inputfieldid);
      inputField.value = "";
    },
    async addComment() {
      var inputField = document.getElementById("inputfield-comments");
      let commentTextObject = {
        commentText: inputField.value
      };
      await this.$store.dispatch("postPage/postPageAddedComments", {
        postPageId: this.$route.params.postPageId,
        comment: commentTextObject
      });
      this.socket.emit("comment", this.addCommentObject);
      inputField.value = "";
      this.showcomments = true;
    },
    async addReply(commentId, inputId) {
      var inputField = document.getElementById(inputId);
      let replyTextObject = {
        replyText: inputField.value
      };
      await this.$store.dispatch("postPage/postPageAddedReplies", {
        postPageId: this.$route.params.postPageId,
        commentId: commentId,
        reply: replyTextObject
      });
      this.socket.emit("reply", this.addReplyObject);
      inputField.value = "";
    },
    showCommentsList() {
      this.showcomments = !this.showcomments;
    },
    userLikeComment(id) {
      let likeCondition;
      const like = document.getElementById(id);
      if (like.style.color == "grey") {
        like.style.color = "blue";
        likeCondition = "like";
      } else if (like.style.color == "blue") {
        like.style.color = "grey";
        likeCondition = "unLike";
      }
      this.$store.dispatch("postPage/likeComments", {
        pinId: this.$route.params.postPageId,
        commentId: id,
        likeCondition: likeCondition
      });
    },
    userLikeReply(replyid, commentid) {
      let likeCondition;
      const likeReply = document.getElementById(replyid);
      if (likeReply.style.color == "grey") {
        likeReply.style.color = "blue";
        likeCondition = "like";
      } else if (likeReply.style.color == "blue") {
        likeReply.style.color = "grey";
        likeCondition = "unLike";
      }
      this.$store.dispatch("postPage/likeReplies", {
        pinId: this.$route.params.postPageId,
        commentId: commentid,
        replyId: replyid,
        likeCondition: likeCondition
      });
    },
    showCommentReplies(id, divid) {
      const showReplies = document.getElementById(id);
      const typingReply = document.getElementById(divid);
      if (
        showReplies.style.display == "none" ||
        showReplies.style.display == ""
      ) {
        showReplies.style.display = "block";
      } else {
        showReplies.style.display = "none";
        typingReply.style.display = "none";
      }
    },
    editPin() {
      if (this.pinType == "saved") {
        this.$store.commit("homeCards/setSavedPinInfo", true);
        this.$store.commit("homeCards/setCreatedPinInfo", false);
        this.$store.commit("homeCards/setshowUnSaveBtn", true);
        this.$store.commit("homeCards/setshowDeleteBtn", false);
        this.$store.commit("homeCards/setCardId", this.pinId);
        this.$store.commit("homeCards/setCardImageId", this.postImage);
        this.$store.commit("popUpsState/toggleEditPinPopUp");
      } else if (this.pinType == "creator") {
        this.$store.commit("homeCards/setCreatedPinInfo", true);
        this.$store.commit("homeCards/setSavedPinInfo", false);
        this.$store.commit("homeCards/setshowUnSaveBtn", false);
        this.$store.commit("homeCards/setshowDeleteBtn", true);
        this.$store.commit("homeCards/setCardId", this.pinId);
        this.$store.commit("homeCards/setCardImageId", this.postImage);
        this.$store.commit("popUpsState/toggleEditPinPopUp");
      }
    },
    async savePin(event) {
      event.preventDefault();
      this.$store.commit("homeCards/setCardImageId", this.postImage);
      this.$store.commit("homeCards/setCardId", this.pinId);
      await this.$store.dispatch("homeCards/getPinType", this.pinId);
      if (this.pinType == "saved" || this.pinType == "creator")
        this.$store.commit("homeCards/setShowToastState", true);
      else this.$store.commit("popUpsState/toggleSavePinPopUp");
    },
    showReportPin() {
      this.$store.commit("homeCards/setCardId", this.pinId);
      this.$store.commit("popUpsState/toggleReportPinPopUp");
    },
    downloadImage() {
      this.$store.dispatch("homeCards/downloadImage", this.postImage);
    }
  },
  created: function() {
    window.addEventListener("click", this.hideList);
    this.socket = io.connect("http://localhost:3000");
    this.socket.on("sendComment", data => {
      this.$store.commit("postPage/addNewComment", data);
    });
    this.socket.on("sendReply", data => {
      this.$store.commit("postPage/addNewReply", {
        reply: data,
        commentId: data.commentId
      });
    });
  },
  beforeDestroy: function() {
    window.removeEventListener("click", this.hideList);
    this.socket.disconnect();
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
    }, 2000);
    this.$store.dispatch(
      "postPage/getPinComments",
      this.$route.params.postPageId
    );
    if (this.userData != null) this.showGoogleImage = true;
  },
  computed: {
    ...mapState({
      reactThisPin: state => state.homeCards.reactThisPin,
      numReactHaha: state => state.homeCards.numReactHaha,
      numReactWow: state => state.homeCards.numReactWow,
      numReactLove: state => state.homeCards.numReactLove,
      numReactGoodIdea: state => state.homeCards.numReactGoodIdea,
      numReactThanks: state => state.homeCards.numReactThanks,
      pinComments: state => state.postPage.pinComments,
      likeComment: state => state.postPage.likeComment,
      addCommentObject: state => state.postPage.addCommentObject,
      addReplyObject: state => state.postPage.addReplyObject,
      pinType: state => state.homeCards.pinType,
      postTitle: state => state.homeCards.postTitle,
      postDescribtion: state => state.homeCards.postDescribtion,
      userData: state => state.user.userData
    }),
    ...mapGetters({
      postImage: "homeCards/postImage",
      userImageId: "homeCards/userImageId",
      userFirstName: "homeCards/userFirstName",
      userLastName: "homeCards/userLastName",
      numberofFollowers: "homeCards/numberofFollowers",
      pinCreatorId: "homeCards/pinCreatorId",
      isFollowed: "phantomUser/isFollowed",
      pinId: "homeCards/pinId",
      postPageLoading: "homeCards/postPageLoading",
      google: "homeCards/google",
      googleImage: "homeCards/googleImage"
    })
  },
  watch: {
    userData() {
      if (this.userData == null) this.showGoogleImage = false;
      else this.showGoogleImage = true;
    }
  }
};
</script>
