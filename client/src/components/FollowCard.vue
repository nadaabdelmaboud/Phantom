<template>
  <div class="followCard">
    <div class="cardImageDiv">
      <img v-lazy="getImage(cardImage)" class="cardImg" alt="Card image" />
    </div>
    <div class="cardContent">
      <div class="cardInfo">
        <h5 class="cardName">{{ firstName }} {{ lastName }}</h5>
        <p class="numFollowers">{{ followers }} Followers</p>
        <p class="recommendType">{{ type }}</p>
      </div>
      <div class="followBtn">
        <button
          class="followButton"
          v-bind:id="this.userId + 0"
          @click="followUser"
        >
          Follow
        </button>
        <button
          class="unfollowButton"
          v-bind:id="this.userId + 1"
          @click="unfollowUser"
        >
          Following
        </button>
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
  width: 275px;
  border-radius: 12px;
  background-color: white;
  padding: 12px;
  &:hover {
    background-color: rgba(212, 209, 209, 0.5);
  }
}
img {
  width: 236px;
  height: 236px;
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
  font-size: 12px;
  color: rgb(112, 110, 110);
}
.cardContent {
  display: flex;
  margin-top: 12px;
}
.followButton,
.unfollowButton {
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
.unfollowButton {
  display: none;
  width: 87px;
  height: 42px;
  padding: 4px;
  margin-right: 3px;
}
button:focus {
  outline: 0 !important;
}
.cardInfo {
  text-align: start;
  width: 68%;
}
.followBtn {
  width: 32%;
}
@media screen and (max-width: 300px) {
  .followCard {
    width: 263px;
  }
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
    },
    type: {
      type: String
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    followers: {
      type: Number
    },
    userId: {
      type: String
    },
    typeOfCard: {
      type: String
    }
  },
  methods: {
    followUser() {
      this.$store.dispatch("follow/followPinCreator", {
        pinCreatorId: this.userId,
        type: this.typeOfCard
      });
      const followBtn = document.getElementById(this.userId + 0);
      const unfollowBtn = document.getElementById(this.userId + 1);
      unfollowBtn.style.display = "block";
      followBtn.style.display = "none";
    },
    unfollowUser() {
      this.$store.dispatch("follow/unFollowPinCreator", {
        pinCreatorId: this.userId,
        type: this.typeOfCard
      });
      const followBtn = document.getElementById(this.userId + 0);
      const unfollowBtn = document.getElementById(this.userId + 1);
      unfollowBtn.style.display = "none";
      followBtn.style.display = "block";
    }
  }
};
</script>
