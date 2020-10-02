<template>
  <div id="changePhoto" @click="closePopup" @keydown.esc="closePopup">
    <div class="popup-content">
      <p class="title">Change your picture</p>
      <div class="row action-buttons">
        <button @click="$refs.imgFile.click()">
          Choose photo
        </button>
        <input
          type="file"
          accept="image/png, image/jpeg"
          ref="imgFile"
          style="display: none;"
          id="img"
          @change="fileSelected"
        />
      </div>
      <br />
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      image: null
    };
  },
  methods: {
    closePopup() {
      this.$store.commit("popUpsState/toggleChangePhotoPopUp");
    },
    fileSelected(event) {
      this.image = event.target.files[0];
      let formData = new FormData();
      formData.append("file", this.image);
      this.$store.dispatch("user/changeProfilePic", formData);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/Mixins";
#changePhoto {
  @include popUpBackground;
}

.title {
  @include popUpTitle;
}

/**PopUp
*******************/
.popup-content {
  @include popUpContent;
  width: 40vw;
  min-width: 350px;
  margin-top: 35vh;
}

/**Buttons
*****************/
button,
button:focus {
  @include profileButton;
  background-color: $queenBlue;
  color: $qainsboro;
  font-size: 14px;
}
</style>
