<template>
  <div id="changePassword">
    <div class="popup-content">
      <div>
        <p class="title">Change your password</p>
        <label class="col col1">Old Password</label>
        <input class="col col2" type="password" v-model="oldPassword" />
        <br />
        <p v-if="emptyOldPassword" class="error">
          You must enter the old password click forget it if you don't remeber
          it.
        </p>
        <button @click="forgetPassword" class="forget-button">
          Forget it?
        </button>
        <hr />
        <label class="col col1">New Password</label>
        <input
          class="col col2"
          type="password"
          v-model="newPassword"
          @input="validatePassword()"
        />
        <br />
        <CheckPasswordFormat :password="this.newPassword" class="format" />
        <hr />
        <label class="col col1">Type it again</label>
        <input
          class="col col2"
          type="password"
          v-model="confirmPassword"
          @input="passwordMatch()"
        />
        <br />
        <div v-if="!this.passwordMatching">
          <p class="error">Password mismatching</p>
        </div>
        <br />
        <div class="row action-buttons">
          <button @click="closePopup">
            Cancel
          </button>
          <button @click="changePassword">
            Change Password
          </button>
        </div>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import CheckPasswordFormat from "../../components/GeneralComponents/CheckPasswordFormat";
export default {
  data: function() {
    return {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      passwordMatching: true,
      emptyOldPassword: false
    };
  },
  methods: {
    closePopup() {
      this.$store.commit("popUpsState/toggleChangePasswordPopUp");
    },
    forgetPassword() {
      this.closePopup();
      this.$store.dispatch(
        "user/forgetPassword",
        this.$store.state.user.userData.email
      );
      this.$store.commit("popUpsState/toggleForgetPasswordPopUp");
    },
    validatePassword() {
      this.$store.commit("user/validatePassword", this.newPassword);
      if (this.oldPassword == "") this.emptyOldPassword = true;
    },
    passwordMatch() {
      if (this.newPassword === this.confirmPassword)
        this.passwordMatching = true;
      else this.passwordMatching = false;
    },
    changePassword() {
      this.validatePassword();
      this.passwordMatch();
      if (this.passwordMatching && this.validPassword && this.oldPassword) {
        this.$store.dispatch("user/resetPassword", {
          forgetPassword: false,
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
          token: localStorage.getItem("userToken")
        });
        this.closePopup();
      }
    }
  },
  components: {
    CheckPasswordFormat
  },
  computed: {
    validPassword: function() {
      return this.$store.state.user.validPassword;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/Mixins";
#changePassword {
  @include popUpBackground;
}

.title {
  @include popUpTitle;
}
/**PopUp
*******************/
.popup-content {
  @include popUpContent;
  width: 500px;
  margin-top: 2vh;
}

/**Input Fields
******************/
input {
  @include inputField;
}

/**Buttons
*****************/
button,
button:focus {
  @include profileButton;
  background-color: $qainsboro;
  color: black;
  font-size: 14px;
  outline: none;
}

.action-buttons {
  position: relative;
  right: -200px;
  margin-right: 10px;
}

.forget-button {
  position: relative;
  left: 150px;
  margin-right: 10px;
  max-width: 100px;
}
/**labels
*****************/
label {
  font-weight: bold;
  font-size: 14px;
}
/**Columns
*****************/
.col1 {
  width: 10vw;
}

.col2 {
  width: 18vw;
}
/**Input Error
******************/
.error {
  color: red;
  font-size: 12px;
  margin-left: 10vw;
}

.format {
  margin-left: 150px;
}

/*Media Quires
******************/
@media screen and (max-width: 1280px) {
  .popup-content {
    width: 350px;
    line-height: 1em;
  }

  .title {
    font-size: 18px;
    margin-bottom: 4px;
  }

  p,
  label {
    font-size: 14px;
    margin: 0;
  }

  input {
    width: 300px;
    height: 30px;
  }

  .col1 {
    width: 40vw;
    position: relative;
    left: -10px;
  }

  .forget-button {
    position: relative;
    left: 10px;
    margin-left: 0;
    margin-bottom: 2px;
  }

  .action-buttons {
    position: relative;
    right: -10px;
    margin: 5px auto;
  }

  button {
    font-size: 14px;
  }

  hr {
    margin: 4px 10px;
  }

  .error {
    font-size: 10px;
    margin-left: 10px;
    margin-bottom: 4px;
    max-width: 200px;
  }

  .format {
    margin-left: 10px;
  }
}

@media screen and (max-width: 600px) {
  .popup-content {
    width: 250px;
  }

  .title {
    font-size: 16px;
  }

  p,
  label {
    font-size: 12px;
  }

  input {
    width: 150px;
  }

  .col1 {
    width: 40vw;
    position: relative;
    left: -10px;
  }

  .forget-button {
    margin-left: 0;
  }

  .action-buttons {
    position: relative;
    right: -10px;
    margin: 5px auto;
  }

  button {
    font-size: 10px;
  }
}
</style>
