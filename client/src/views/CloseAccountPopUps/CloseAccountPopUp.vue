<template>
  <div id="closeAccount">
    <div class="popup-content">
      <p class="title">Are you sure?</p>
      <p>
        Closing your account means you won’t be able to get your Pins or boards
        back. All your Pinterest account data will be deleted. If you’re ready
        to leave forever, we’ll send you an email with the final step to
        <strong>{{ email }}</strong>
      </p>
      <div class="row action-buttons">
        <button
          @click="closePopup"
          style="background-color: #dedddd; color: black;"
        >
          Cancel
        </button>
        <button @click="sendEmail">
          Send Email
        </button>
      </div>
      <br />
    </div>
  </div>
</template>

<script>
import removeUserData from "../../mixins/removeUserData";

export default {
  methods: {
    closePopup() {
      this.$store.commit("popUpsState/toggleAccountClosingPopup");
    },
    sendEmail() {
      this.$store.commit("popUpsState/toggleAccountClosingPopup");
      this.$store.dispatch("user/updateUserSettings", {
        deleteFlag: true
      });
      this.removeUserData();
      this.$router.push("/");
    }
  },
  computed: {
    email: function() {
      return this.$store.state.user.userData.email;
    }
  },
  mixins: [removeUserData]
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/Mixins";
#closeAccount {
  @include popUpBackground;
}

.title {
  @include popUpTitle;
}

/**PopUp
*******************/
.popup-content {
  @include popUpContent;
  width: 600px;
  margin-top: 35vh;
}

/**Buttons
*****************/
button,
button:focus {
  @include profileButton;
  background-color: $queenBlue;
  color: $qainsboro;
  font-size: 14px;
  outline: none;
}

.action-buttons {
  float: right;
  margin-right: 10px;
}

/*Media Quires
******************/
@media screen and (max-width: 600px) {
  .popup-content {
    width: 250px;
  }

  .title {
    font-size: 16px;
  }

  p {
    font-size: 12px;
  }
}
</style>
