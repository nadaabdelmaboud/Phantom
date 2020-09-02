<template>
  <div id="welcome">
    <div class="popup-content">
      <div class="circles row">
        <div class="dot"></div>
        <div class="small-dot"></div>
        <div class="small-dot"></div>
        <div class="small-dot"></div>
      </div>
      <div class="circle">
        <p>{{ this.firstChar }}</p>
      </div>
      <p>{{ this.email }}</p>
      <p class="title">Welcome to Phantom</p>
      <p class="title">{{ this.firstName }} !</p>
      <p>
        Your answers to the next few questions will helpus find the right ideas
        for you
      </p>
      <button @click="nextPopUp">Next</button>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      email: null,
      firstName: null,
      firstChar: null
    };
  },
  created: function() {
    this.$store.dispatch("user/getUserProfile");
    this.updateModels();
  },
  methods: {
    nextPopUp() {
      this.$store.commit("popUpsState/toggleWelcomeState");
      this.$store.commit("popUpsState/toggleGenderPopUp");
    },
    updateModels: function() {
      this.email = this.userData.email;
      this.firstName = this.userData.firstName;
      this.firstChar = this.userData.firstName.charAt(0);
    }
  },
  computed: {
    userData: function() {
      return this.$store.state.user.userData;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/Mixins";

/**Progress Circles
********************/
.circles {
  display: flex;
  justify-content: center;
  margin: 10px 0 30px 0;
}
.dot {
  background-color: black;
  border-radius: 10px;
  width: 10px;
  height: 10px;
}

.small-dot {
  background-color: darkgray;
  border-radius: 8px;
  width: 8px;
  height: 8px;
  margin: 0 2px;
}

/**PopUp
*******************/
#welcome {
  @include popUpBackground;
}
.popup-content {
  @include popUpContent;
  width: 400px;
  margin-top: 25vh;
}

/**Buttons
*****************/
button {
  @include profileButton;
  background-color: $queenBlue;
  color: $qainsboro;
  font-size: 16px;
  outline: none;
  padding: 5px 150px;
}

/**Paragraphs
****************/
p {
  text-align: center;
  font-size: 12px;
  margin-bottom: 10px;
}

.title {
  @include popUpTitle;
}
/**Circled Char
****************/
.circle {
  background-color: $qainsboro;
  border-radius: 80px;
  width: 80px;
  height: 80px;
  margin: 10px auto;
}

.circle p {
  font-size: 36px;
  font-weight: bold;
  padding-top: 13px;
}
</style>
