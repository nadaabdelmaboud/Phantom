<template>
  <div class="card" @click="toPage">
    <div class="flex">
      <img v-lazy="getImage(imageId,google,googleImage)" />
      <img v-lazy="getImage(imageId,google,googleImage)" />
      <div>
        <label>{{ title }}</label>
        <p>{{ body }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { default as getImage } from "../../mixins/getImage";
export default {
  name: "NotificationActionsCard",
  data: function() {
    return {};
  },
  mixins: [getImage],
  props: {
    imageId: {
      type: String
    },
    pinId: {
      type: String
    },
    title: {
      type: String
    },
    body: {
      type: String
    },
    followerId: {
      type: String
    },
    google:{
      type:Boolean
    },
    googleImage:{
      type:String
    }
  },
  methods: {
    toPage() {
      if (this.title.includes("your follower increase"))
        this.$router.push("/User/" + this.followerId);
      else this.$router.push("/PostPage/" + this.pinId);
      this.$store.commit("notifications/alterShow", false);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
.flex {
  display: flex;
  margin: 0;
}
.card {
  border: none;
  border-radius: 16px;
  padding: 10px;
  transition: 0.3s linear;
  margin: 5px 0;
  background-color: $queenPink;
  cursor: pointer;
}
.card:hover {
  background-color: $queenPinkHover;
}
img {
  border-radius: 50%;
  width: 48px;
  height: 48px;
  margin-right: 10px;
}
label,
p {
  margin: 0;
  color: $queenBlue;
}
p {
  font-size: 14px;
}
</style>
