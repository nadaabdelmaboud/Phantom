<template>
  <div id="gender">
    <div class="popup-content">
      <div class="circles row">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="small-dot"></div>
        <div class="small-dot"></div>
      </div>
      <p class="title">How do you identify?</p>
      <input type="radio" id="male" value="male" v-model="gender" />
      <label for="male">Male</label>
      <br />
      <input type="radio" id="female" value="female" v-model="gender" />
      <label for="female">Female</label>
      <button @click="nextPopUp" :class="{ disable: gender == null }">
        Next
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      gender: null
    };
  },
  methods: {
    nextPopUp() {
      if (this.gender != null) {
        this.$store.dispatch("user/updateUserInfo", {
          gender: this.gender
        });
        this.$store.commit("popUpsState/toggleGenderPopUp");
        this.$store.commit("popUpsState/toggleCountryPopUp");
      }
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
  margin: 0 4px;
}

.small-dot {
  background-color: darkgray;
  border-radius: 8px;
  width: 8px;
  height: 8px;
  margin: 0 4px;
}

/**PopUp
*******************/
#gender {
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
  margin-top: 20px;
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
  font-weight: bold;
  font-size: 18px;
  margin: 10px 5px;
}
</style>
