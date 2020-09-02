<template>
  <div class="home">
    <CreateBoardPopup v-if="createBoard" />
    <NewPinPopup v-if="newPin" />
    <EditBoardPopup v-if="editBoard" />
    <CollaboratorsPopup v-if="collaborators" />
    <TopicsPopup v-if="topics" />
    <div>
      <HomeNavigationBar />
      <router-view class="mainComponent" />
      <i class="fa fa-comment globalIcons" @click="toggleChat"></i>
      <router-link
        tag="i"
        class="fa fa-plus globalIcons"
        to="/PinBuilder"
      ></router-link>
      <i class="fa fa-question-circle globalIcons"></i>
    </div>
    <ChatWindow v-if="chat" id="chat" />
    <ChangePasswordPopUp v-if="changePassword" />
    <ForgetPasswordPopUp v-if="forgetPassword" />
    <WelcomePopUp v-if="welcomePopUp" />
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/Colors";
.mainComponent {
  background-color: $offWhite;
  min-height: calc(100vh);
  padding-top: 80px;
}
.home {
  .globalIcons {
    height: 48px;
    width: 48px;
    position: fixed;
    left: 92%;
    font-size: 24px;
    color: $darkBlue;
    border-radius: 50%;
    padding: 12px;
    text-align: center;
    box-shadow: 4px 4px 4px #888888;
    z-index: 2;
    transition: background-color 0.5s ease;
    background-color: $offWhite;
  }
  .globalIcons:hover {
    background-color: $lightPink;
  }

  .globalIcons:nth-child(3) {
    bottom: 170px;
  }
  .globalIcons:nth-child(4) {
    bottom: 110px;
  }
  .globalIcons:nth-child(5) {
    bottom: 50px;
  }
}
.away {
  animation: away 0.1s linear forwards;
}
@keyframes away {
  from {
    right: 140px;
  }
  to {
    right: 0;
    opacity: 0;
  }
}
</style>
<script>
import HomeNavigationBar from "../components/HomeNavigationBar";
import CreateBoardPopup from "../views/CreateBoardPopup";
import NewPinPopup from "../views/NewPinPopup";
import EditBoardPopup from "../views/BoardsPopUps/EditBoardPopup";
import CollaboratorsPopup from "../views/BoardsPopUps/CollaboratorsPopup";
import TopicsPopup from "../components/Topics/TopicsPopup";
import ChatWindow from "../components/Chat/ChatWindow";
import ChangePasswordPopUp from "../views/PasswordPopUps/ChangePasswordPopUp";
import ForgetPasswordPopUp from "../views/PasswordPopUps/ForgetPasswordPopUp";
import WelcomePopUp from "../views/SignUpPopUps/WelcomePopUp";

import { mapState } from "vuex";
export default {
  name: "PhantomHome",
  data: function() {
    return {
      chat: false
    };
  },
  components: {
    HomeNavigationBar,
    CreateBoardPopup,
    NewPinPopup,
    EditBoardPopup,
    CollaboratorsPopup,
    TopicsPopup,
    ChatWindow,
    ChangePasswordPopUp,
    ForgetPasswordPopUp,
    WelcomePopUp
  },
  methods: {
    toggleChat() {
      if (this.chat) {
        let chat = document.getElementById("chat");
        chat.classList.add("away");
        setTimeout(() => {
          this.chat = false;
        }, 500);
      } else {
        this.chat = true;
      }
    }
  },
  computed: {
    ...mapState({
      createBoard: state => state.popUpsState.createBoardPopup,
      newPin: state => state.popUpsState.newPinPopup,
      editBoard: state => state.popUpsState.editBoardPopup,
      collaborators: state => state.popUpsState.CollaboratorsPopup,
      topics: state => state.popUpsState.TopicsPopup,
      changePassword: state => state.popUpsState.changePasswordPopUp,
      forgetPassword: state => state.popUpsState.forgetPasswordPopUp,
      welcomePopUp: state => state.popUpsState.welcomePopUp
    })
  }
};
</script>
