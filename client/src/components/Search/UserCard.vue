<template>
  <div class="user-card">
    <router-link :to="{ path: '/User/' + userID }">
      <img :src="imagId" alt="User Photo" v-if="google" />
      <img :src="getImage(imagId)" alt="User Photo" v-else />
      <p class="username">{{ name }}</p>
      <p class="numbers">{{ boardsNum }} boards</p>
      <p class="dot">.</p>
      <p class="numbers">{{ followersNum }} followers</p>
    </router-link>
  </div>
</template>

<script>
import getImage from "../../mixins/getImage";
export default {
  props: {
    imagId: String,
    name: String,
    followersNum: Number,
    boardsNum: Number,
    userID: String,
    google: Boolean
  },
  mixins: [getImage]
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";

.user-card {
  text-align: center;
  display: inline-block;
  padding: 10px 5px;
  margin: 10px 20px;
}

.user-card:hover {
  background-color: $lightPink;
  border-radius: 10px;
}

img {
  width: 200px;
  height: 200px;
  border-radius: 200px;
}

.username {
  margin-top: 5px;
  margin-bottom: 0px;
  font-weight: bold;
}

.numbers {
  display: inline;
  font-weight: lighter;
  font-size: 12px;
  padding: 3px;
}

.dot {
  font-weight: bold;
  display: inline;
  font-size: 18px;
}

a,
a:hover {
  text-decoration: none;
  color: black;
}
</style>
