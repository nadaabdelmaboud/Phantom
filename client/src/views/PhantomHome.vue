<template>
  <div class="home">
    <EditPin v-if="editPinPopUp" />
    <ReportPin v-if="showReportPin" />
    <SavePin v-if="showSavePin" />
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
    <SearchSuggestions v-if="searchSuggestions" />
    <div class="toast" id="toastId">
      <img :src="getImage(cardImage)" alt="User Image" class="toastimage" />
      <div class="userinfo">
        <div id="toastmessage">Saved to</div>
        <div class="toastusername">
          {{ ChoosenBoardName }}
        </div>
      </div>
    </div>
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
    margin-left: 8px;
  }
}
.toast--visible {
  visibility: visible;
  opacity: 1;
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
@media screen and (max-width: 360px) {
  .toast {
    left: 7%;
  }
}
</style>
<script>
import { default as getImage } from "../mixins/getImage";
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
import SearchSuggestions from "../components/Search/SearchSuggestions";
import SavePin from "../components/SavePin";
import ReportPin from "../components/ReportPin";
import EditPin from "../components/EditPin";

import { mapState } from "vuex";
export default {
  name: "PhantomHome",
  data: function() {
    return {
      chat: false,
      componentKey: 0
    };
  },
  mixins: [getImage],
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
    SearchSuggestions,
    SavePin,
    ReportPin,
    EditPin
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
    },
    showToast() {
      var mytoast = document.getElementById("toastId");
      clearTimeout(mytoast.hideTimeout);
      mytoast.className = "toast toast--visible";
      mytoast.hideTimeout = setTimeout(() => {
        mytoast.classList.remove("toast--visible");
      }, 2000);
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
      searchSuggestions: state => state.popUpsState.searchSuggestions,
      showSavePin: state => state.popUpsState.savePinPopUp,
      showReportPin: state => state.popUpsState.reportPinPopUp,
      showToastState: state => state.homeCards.showToastState,
      cardImage: state => state.homeCards.cardImageId,
      ChoosenBoardName: state => state.homeCards.ChoosenBoardName,
      editPinPopUp: state => state.popUpsState.editPinPopUp
    })
  },
  watch: {
    $route() {
      this.componentKey = (this.componentKey + 1) % 4;
    },
    showToastState() {
      if (this.showToastState == true) {
        console.log("phantom home boardname", this.ChoosenBoardName);
        this.showToast();
        this.$store.commit("homeCards/setShowToastState", false);
      }
    }
  }
};
</script>
