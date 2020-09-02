<template>
  <div id="forgetPassword">
    <div class="popup-content">
      <p class="title">Please check your email</p>
      <p>
        We’ll send instructions for changing your password in just a minute.
      </p>
      <div class="row action-buttons">
        <button @click="closePopup">
          Okay
        </button>
      </div>
      <br />
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    closePopup() {
      this.$store.commit("popUpsState/toggleForgetPasswordPopUp");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/Mixins";
#forgetPassword {
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
button {
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
</style>
