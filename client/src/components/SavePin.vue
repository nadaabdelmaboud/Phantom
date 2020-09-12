<template>
  <div class="savePin">
    <div class="content">
      <h5 class="title">Save Pin</h5>
      <div class="pinImage">
        <img :src="getImage(cardImage)" class="cardImg" alt="Card image" />
      </div>
      <div class="optionsDiv">
        <button class="optionBtns" id="cancelButton" @click="closePopUp">
          Cancel
        </button>
        <button class="optionBtns" id="saveButton" @click="savePin">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/Colors";
@import "../scss/Mixins";
.savePin {
  @include popUpBackground;
}
.title {
  @include popUpTitle;
  margin-bottom: 30px;
}
.content {
  @include popUpContent;
  margin-top: 50px;
  padding-left: 1px;
  padding-right: 1px;
  width: 30%;
}
.optionBtns {
  margin-top: 20px;
  margin-left: 8px;
  letter-spacing: 1px;
  background-color: $lightBlue;
  color: white;
  font-weight: 700;
  border-radius: 500px;
  border-color: transparent;
  align-content: center;
  padding: 5px;
  width: 70px;
  &:hover {
    background-color: $darkBlue;
    opacity: 1;
  }
}
button:focus {
  outline: 0 !important;
}
.optionsDiv {
  display: flex;
  justify-content: flex-end;
  margin-right: 27px;
}
.cardImg {
  width: 80%;
  height: 450px;
  border-radius: 12px;
  box-shadow: 0 5px 10px 10px rgba(0, 0, 0, 0.06);
}
.pinImage {
  display: flex;
  justify-content: center;
}
@media screen and (max-width: 1340px) {
  .content {
    width: 40%;
  }
}
@media screen and (max-width: 900px) {
  .content {
    width: 60%;
  }
}
@media screen and (max-width: 600px) {
  .content {
    width: 85%;
  }
}
@media screen and (max-width: 412px) {
  .content {
    width: 95%;
  }
}
</style>

<script>
import { default as getImage } from "../mixins/getImage";
import { mapState } from "vuex";
export default {
  name: "SavePin",
  mixins: [getImage],
  computed: {
    ...mapState({
      cardImage: state => state.homeCards.cardImageId,
      CardId: state => state.homeCards.CardId
    })
  },
  methods: {
    closePopUp() {
      this.$store.commit("popUpsState/toggleSavePinPopUp");
    },
    savePin() {
      this.$store.dispatch("pins/savePost", this.CardId);
      this.$store.commit("popUpsState/toggleSavePinPopUp");
    }
  }
};
</script>
