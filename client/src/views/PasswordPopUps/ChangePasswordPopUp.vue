<template>
  <div id="changePassword">
    <div class="popup-content">
      <div>
        <p class="title">Change your password</p>
        <label class="col col1">Old Password</label>
        <input class="col col2" type="password" v-model="oldPassword" />
        <br />
        <button @click="forgetPassword" class="col forget-button">
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
        <CheckPasswordFormat
          :password="this.newPassword"
          style="margin-left:10vw;"
        />
        <hr />
        <label class="col col1">Type it again</label>
        <input class="col col2" type="password" v-model="confirmPassword" />
        <br /><br />
        <div class="row action-buttons">
          <button @click="closePopup">
            Cancel
          </button>
          <button>
            Change Password
          </button>
        </div>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import CheckPasswordFormat from "../../components/CheckPasswordFormat.vue";
export default {
  data: function() {
    return {
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    };
  },
  methods: {
    closePopup() {
      this.$store.commit("popUpsState/toggleChangePasswordPopUp");
    },
    forgetPassword() {
      this.closePopup();
      this.$store.commit("popUpsState/toggleForgetPasswordPopUp");
    },
    validatePassword() {
      this.$store.commit("user/validatePassword", this.newPassword);
    }
  },
  components: {
    CheckPasswordFormat
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/Mixins";
#changePassword {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 12;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.title {
  text-align: center;
  font-weight: bold;
  font-size: 24px;
  padding: 5px 0px;
}
/**PopUp
*******************/
.popup-content {
  background-color: white;
  margin: 0 auto;
  width: 500px;
  border-radius: 35px;
  padding: 30px;
  margin-top: 15vh;
}

/**Input Fields
******************/
input {
  @include inputField;
}

/**Buttons
*****************/
button {
  @include profileButton;
  background-color: $qainsboro;
  color: black;
  font-size: 14px;
  outline: none;
}

.action-buttons {
  float: right;
  margin-right: 10px;
}

.forget-button {
  margin-left: 10vw;
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
</style>
