<template>
  <div class="followCard">
    <div class="cardImageDiv">
      <!-- <img v-lazy="getImage(cardImage)" class="cardImg" alt="Card image" /> -->
      <img src="../assets/logo.png" class="cardImg" alt="Card image" />
    </div>
    <div class="cardContent">
      <div class="cardInfo">
        <h5 class="cardName">Nihal Mansour</h5>
        <p class="numFollowers">6 Followers</p>
        <p class="recommendType">based on your recent activity</p>
      </div>
      <div class="followBtn">
        <button class="followButton">Follow</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/_Colors";
@import "../scss/Mixins";
.followCard {
  display: block;
  text-align: center;
  width: 300px;
  border-radius: 12px;
  background-color: white;
  padding: 12px;
  &:hover {
    background-color: rgba(212, 209, 209, 0.5);
  }
}
p {
  margin: 0;
}
.cardName {
  font-size: 17px;
  font-weight: 700;
}
.numFollowers {
  font-size: 14px;
  font-weight: 400;
}
.recommendType {
  font-size: 13px;
  color: rgb(112, 110, 110);
}
.cardContent {
  display: flex;
}
.followButton {
  letter-spacing: 1px;
  background-color: $lightBlue;
  color: white;
  border-radius: 500px;
  border-color: transparent;
  align-content: center;
  padding: 5px;
  width: 75px;
  &:hover {
    background-color: $darkBlue;
  }
}
button:focus {
  outline: 0 !important;
}
.cardInfo {
  text-align: start;
  width: 70%;
}
.followBtn {
  width: 30%;
}
</style>

<script>
import { default as getImage } from "../mixins/getImage";
export default {
  name: "FollowCard",
  mixins: [getImage],
  props: {
    cardImage: {
      type: String
    }
  }
};
</script>
