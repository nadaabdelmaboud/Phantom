<template>
  <div class="home">
    <CreateBoardPopup v-if="createBoard" />
    <NewPinPopup v-if="newPin" />
    <EditBoardPopup v-if="editBoard" />
    <CollaboratorsPopup v-if="collaborators" />
    <AddSectionPopup v-if="addSection" />
    <TopicsPopup v-if="topics" />
    <div>
      <HomeNavigationBar />
      <router-view class="mainComponent" :key="componentKey" />
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
    <GenderPopUp v-if="genderPopUp" />
    <CountryPopUp v-if="countryPopUp" />
    <ChangePhotoPopUp v-if="changePhotoPopUp" />
    <LeavingResaonPopUp v-if="leavingPopUp" />
    <CloseAccountPopUp v-if="accountClosingPopup" />
    <SearchWindow v-if="searchWindow" />
    <SearchSuggestions v-if="searchSuggestions" />
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
import CreateBoardPopup from "../views/BoardsPopUps/CreateBoardPopup";
import NewPinPopup from "../views/NewPinPopup";
import EditBoardPopup from "../views/BoardsPopUps/EditBoardPopup";
import CollaboratorsPopup from "../views/BoardsPopUps/CollaboratorsPopup";
import AddSectionPopup from "../views/BoardsPopUps/AddSection";
import TopicsPopup from "../components/Topics/TopicsPopup";
import ChatWindow from "../components/Chat/ChatWindow";
import ChangePasswordPopUp from "../views/PasswordPopUps/ChangePasswordPopUp";
import ForgetPasswordPopUp from "../views/PasswordPopUps/ForgetPasswordPopUp";
import WelcomePopUp from "../views/SignUpPopUps/WelcomePopUp";
import GenderPopUp from "../views/SignUpPopUps/GenderPopUp";
import CountryPopUp from "../views/SignUpPopUps/CountryPopUp";
import ChangePhotoPopUp from "../components/UserSettings/ChangePhotoPopUp";
import LeavingResaonPopUp from "../views/CloseAccountPopUps/LeavingReasonPopUp";
import CloseAccountPopUp from "../views/CloseAccountPopUps/CloseAccountPopUp";
import SearchWindow from "../components/Search/SearchWindow";
import SearchSuggestions from "../components/Search/SearchSuggestions";

import { mapState } from "vuex";
export default {
  name: "PhantomHome",
  data: function() {
    return {
      chat: false,
      componentKey: 0
    };
  },
  components: {
    HomeNavigationBar,
    CreateBoardPopup,
    NewPinPopup,
    EditBoardPopup,
    CollaboratorsPopup,
    TopicsPopup,
    AddSectionPopup,
    ChatWindow,
    ChangePasswordPopUp,
    ForgetPasswordPopUp,
    WelcomePopUp,
    GenderPopUp,
    CountryPopUp,
    ChangePhotoPopUp,
    LeavingResaonPopUp,
    CloseAccountPopUp,
    SearchWindow,
    SearchSuggestions
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
      addSection: state => state.popUpsState.addSection,
      changePassword: state => state.popUpsState.changePasswordPopUp,
      forgetPassword: state => state.popUpsState.forgetPasswordPopUp,
      welcomePopUp: state => state.popUpsState.welcomePopUp,
      genderPopUp: state => state.popUpsState.genderPopUp,
      countryPopUp: state => state.popUpsState.countryPopUp,
      changePhotoPopUp: state => state.popUpsState.changePhotoPopUp,
      accountClosingPopup: state => state.popUpsState.accountClosingPopup,
      leavingPopUp: state => state.popUpsState.leavingPopUp,
      searchWindow: state => state.popUpsState.searchWindow,
      searchSuggestions: state => state.popUpsState.searchSuggestions
    })
  },
  watch: {
    $route() {
      this.componentKey = (this.componentKey + 1) % 4;
    }
  }
};
</script>
