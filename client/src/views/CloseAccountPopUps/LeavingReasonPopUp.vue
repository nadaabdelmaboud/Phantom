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
      <div class="row action">
        <button @click="closePopUp" class="close-button">
          Cancel
        </button>
        <button
          @click="nextPopUp"
          class="next"
          :class="{ disable: reason == null }"
        >
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
}

.disable {
  opacity: 0.6;
  cursor: default;
}

.next {
  left: 310px;
  position: relative;
}

.close-button {
  left: 300px;
  position: relative;
  background-color: #dedddd;
  color: black;
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

/*Media Quires
******************/
@media screen and (max-width: 1200px) {
  .popup-content {
    width: 400px;
  }

  .title {
    font-size: 18px;
  }

  p,
  label {
    font-size: 12px;
  }

  button {
    font-size: 12px;
  }

  .action {
    position: relative;
    right: -5px;
  }

  .close-button {
    margin-left: 120px;
  }
}

@media screen and (max-width: 500px) {
  .popup-content {
    width: 300px;
  }

  .title {
    font-size: 16px;
  }

  .close-button {
    margin-left: 80px;
  }
}

@media screen and (max-width: 300px) {
  .popup-content {
    width: 200px;
    margin-top: 10vh;
  }

  .title {
    font-size: 14px;
  }

  p,
  label {
    font-size: 7px;
    margin-top: 0;
  }

  .close-button {
    margin-left: 20px;
    font-size: 10px;
  }
}
</style>
