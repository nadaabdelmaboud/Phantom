<template>
  <div id="newPin" @click="newPinPopup">
    <div class="newPinData">
      <h1>Saved to new</h1>
      <div class="imgWrapper">
        <img :src="getImage(pin.imageId)" />
      </div>
      <div class="buttonDiv">
        <div @click="closePopup">
          <router-link :to="{ path: '/PostPage/' + pin._id }" tag="button">
            See it now
          </router-link>
        </div>
        <button>
          <i class="fa fa-upload" aria-hidden="true"></i>
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { default as getImage } from "../mixins/getImage";
import { mapState } from "vuex";
export default {
  name: "newPinPopup",
  data: function() {
    return {
      boardName: "",
      noName: false
    };
  },
  mixins: [getImage],
  methods: {
    newPinPopup(event) {
      if (event.target.id == "newPin") {
        this.$store.commit("popUpsState/toggleNewPin");
        this.$router.push("/");
      }
    },
    closePopup() {
      console.log("sdfghjk");
      this.$store.commit("popUpsState/toggleNewPin");
    }
  },
  computed: {
    ...mapState({
      pin: state => state.pins.pin
    })
  }
};
</script>

<style lang="scss" scoped>
@import "../scss/Colors";

#newPin {
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
.newPinData {
  margin: 90px auto;
  background-color: white;
  width: 450px;
  padding: 20px;
  border-radius: 32px;
}
@media screen and (max-width: 500px) {
  .newPinData {
    margin: 50px auto;
    width: 97%;
  }
}
h1 {
  width: 100%;
  text-align: center;
  font-size: 32px;
  font-weight: 700;
}
.imgWrapper {
  margin: auto;
  width: 200px;
  margin-bottom: 30px;
  img {
    width: 100%;
    border-radius: 32px;
  }
}
.buttonDiv::after {
  content: "";
  clear: both;
  display: table;
}
button {
  float: right;
  position: relative;
  background-color: $darkBlue;
  color: $lightPink;
  height: 43px;
  border: none;
  padding: 10px 20px;
  border-radius: 32px;
  font-weight: 700;
}
button:nth-child(2) {
  margin-right: 10px;
  background-color: $lightPink;
  color: $darkBlue;
  i {
    margin-right: 5px;
  }
}
</style>
