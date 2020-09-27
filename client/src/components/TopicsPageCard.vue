<template>
  <div class="topicsCard">
    <div class="cardContent">
      <div class="cardView">
        <img
          :src="getImage(imageId)"
          class="card-img"
          alt="Card image"
          @click="toTopicsPage"
        />
        <div class="topicsName">
          {{ topicName }}
        </div>
      </div>
      <div class="followTopics">
        <button class="followTopicButton" @click="followTopic" v-if="!isFollow">
          Follow
        </button>
        <button
          class="unfollowTopicButton"
          @click="unfollowTopic"
          v-if="isFollow"
        >
          Following
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/_Colors";
.topicsCard {
  width: 230px;
  height: 290px;
  border-radius: 12px;
  justify-content: center;
  border-color: transparent;
}
.topicsCard:hover {
  background-color: rgb(170, 169, 169);
}
.cardContent {
  margin: auto;
  padding-top: 10px;
  width: 220px;
  height: 220px;
}
img {
  width: 220px;
  height: 220px;
  border-radius: 12px;
}
.cardView {
  position: relative;
  text-align: center;
  cursor: pointer;
}
.topicsName {
  color: white;
  font-weight: 700;
  font-size: 18px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.followTopicButton,
.unfollowTopicButton {
  width: 220px;
  border-radius: 25px;
  background-color: black;
  color: white;
  font-weight: 500;
  border: transparent;
  height: 40px;
}
.followTopicButton:hover,
.unfollowTopicButton:hover {
  transition: transform 0.5s;
  transform: scale(1.02);
}
.unfollowTopicButton {
  background-color: rgb(77, 75, 75);
}
button:focus {
  outline: 0;
}
.followTopics {
  margin-top: 7px;
  cursor: pointer;
}
</style>

<script>
import { default as getImage } from "../mixins/getImage";
export default {
  name: "TopicsPageCard",
  data: function() {
    return {
      google: false,
      imgSrc: ""
    };
  },
  mixins: [getImage],
  props: {
    topicId: {
      type: String
    },
    imageId: {
      type: String
    },
    topicName: {
      type: String
    },
    isFollow: {
      type: Boolean
    }
  },
  methods: {
    toTopicsPage() {
      //add router link
      //this.$router.push("/TopicsPage");
    },
    followTopic() {
      this.$store.dispatch("topics/followTopic", this.topicId);
    },
    unfollowTopic() {
      this.$store.dispatch("topics/unfollowTopic", this.topicId);
    }
  }
};
</script>
