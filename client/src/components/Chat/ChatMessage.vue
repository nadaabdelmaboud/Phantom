<template>
  <div class="msg" :class="{ mymsg: owner }">
    <img :src="getImage(imageId,google,googleImage)" v-if="owner && last && seen" />
    <img :src="getImage(imageId,google,googleImage)" v-if="!owner && last" />
    <div class="status">
      <i
        class="fa fa-check-circle"
        v-if="owner && !seen"
        :class="{ delivered: delivered }"
      ></i>
    </div>
    <p class="msgText">
      {{ msgText }}
    </p>
  </div>
</template>

<script>
import { default as getImage } from "../../mixins/getImage";
import { default as getUserImage } from "../../mixins/getUserImage";
export default {
  name: "BoardPins",
  data: function() {
    return {};
  },
  mixins: [getImage, getUserImage],
  props: {
    imageId: {
      type: String
    },
    msgText: {
      type: String
    },
    owner: {
      type: Boolean
    },
    timeStamp: {},
    last: {
      type: Boolean
    },
    seen: {
      type: Boolean
    },
    delivered: {
      type: Boolean
    },
    google:{
      type:Boolean
    },
    googleImage:{
      type:String
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
.msg {
  display: flex;
  margin: 5px 0;
  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    align-self: start;
  }
}
.mymsg {
  flex-direction: row-reverse;
}
img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  align-self: start;
}
p {
  margin: 0;
  font-size: 16px;
  min-height: 48px;
  padding: 10px;
  background-color: $offWhite;
  border-radius: 32px;
  max-width: 70%;
  word-break: break-all;
  position: relative;
  color: $darkBlue;
}
.fa-check {
  position: absolute;
  right: 12px;
  font-size: 10px;
  bottom: 12px;
  font-weight: 200;
  color: $lightBlue;
}
.fa-check-circle {
  color: white;
  background-color: $lightPink;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  padding-left: 1.5px;
  margin: 6px 2px;
}
.delivered {
  background-color: $darkBlue;
}
.status {
  display: flex;
  flex-direction: column-reverse;
}
</style>
