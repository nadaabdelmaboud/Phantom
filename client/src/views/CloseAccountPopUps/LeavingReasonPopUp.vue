<template>
  <div id="leaving-reason">
    <div class="popup-content">
      <p class="title">Tell us why we're leaving</p>

      <input type="radio" id="manyEmails" value="manyEmails" v-model="reason" />
      <label for="manyEmails">I’m getting too many emails</label>
      <br />
      <input
        type="radio"
        id="anotherAccount"
        value="anotherAccount"
        v-model="reason"
      />
      <label for="anotherAccount">I accidentally made another account</label>
      <br />
      <input type="radio" id="privacy" value="privacy" v-model="reason" />
      <label for="privacy">I'm concerned about privacy</label>
      <br />
      <input
        type="radio"
        id="businessAccount"
        value="businessAccount"
        v-model="reason"
      />
      <label for="businessAccount">I want a business account</label>
      <br />
      <input type="radio" id="other" value="other" v-model="reason" />
      <label for="other">Other</label>
      <br />
      <div class="row">
        <button
          @click="closePopUp"
          style="margin-left: 300px; background-color: #dedddd; color: black;"
        >
          Cancel
        </button>
        <button @click="nextPopUp" :class="{ disable: reason == null }">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      reason: null
    };
  },
  methods: {
    nextPopUp() {
      this.$store.commit("popUpsState/toggleLeavingPopUp");
      this.$store.commit("popUpsState/toggleAccountClosingPopup");
    },
    closePopUp() {
      this.$store.commit("popUpsState/toggleLeavingPopUp");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/Mixins";

/**PopUp
*******************/
#leaving-reason {
  @include popUpBackground;
}

.popup-content {
  @include popUpContent;
  width: 500px;
  margin-top: 25vh;
}

select {
  @include inputField;
  width: 300px;
  margin: 50px 20px;
}
/**Buttons
*****************/
button,
button:focus {
  @include profileButton;
  background-color: $queenBlue;
  color: $qainsboro;
  font-size: 16px;
  outline: none;
  padding: 5px 10px;
  margin-top: 20px;
  float: right;
}

.disable {
  opacity: 0.6;
  cursor: default;
}

/**Paragraphs
****************/
p {
  text-align: center;
}

.title {
  @include popUpTitle;
}

/**Labels
******************/
label {
  font-size: 18px;
  margin: 10px 5px;
}
</style>
