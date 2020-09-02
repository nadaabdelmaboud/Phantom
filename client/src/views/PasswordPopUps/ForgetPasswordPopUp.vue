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
}
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/Mixins";
#forgetPassword {
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
  width: 600px;
  border-radius: 35px;
  padding: 30px;
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
