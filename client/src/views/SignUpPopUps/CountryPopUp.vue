<template>
  <div id="country">
    <div class="popup-content">
      <div class="circles row">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="small-dot"></div>
      </div>
      <p class="title">Pick your country/region</p>
      <span></span>
      <select name="country" v-model="country">
        <option
          v-for="country in getCountriesName()"
          :key="country.name"
          :value="country.name"
          >{{ country.name }}</option
        >
      </select>
      <button @click="nextPopUp" :class="{ disable: country == null }">
        Next
      </button>
    </div>
  </div>
</template>

<script>
import getCountriesName from "../../mixins/getCountriesName";

export default {
  data: function() {
    return {
      country: "Egypt"
    };
  },
  methods: {
    nextPopUp() {
      if (this.country != null) {
        this.$store.dispatch("user/updateUserInfo", {
          country: this.country
        });
        this.$store.commit("popUpsState/toggleCountryPopUp");
        this.$store.commit("popUpsState/toggleTopicsPopup");
      }
    }
  },
  mixins: [getCountriesName]
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
#country {
  @include popUpBackground;
}

.popup-content {
  @include popUpContent;
  width: 400px;
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

/*Media Quires
******************/
@media screen and (max-width: 600px) {
  .popup-content {
    width: 250px;
  }

  button {
    padding: 5px 80px;
  }

  .title {
    font-size: 16px;
  }

  select {
    width: 80px;
    margin: 50px 0px;
  }
}
</style>
