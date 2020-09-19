<template>
  <div class="msg" :class="{ mymsg: owner }">
    <img :src="getImage(imageId)" v-if="owner" />
    <img :src="getUserImage()" v-else />
    <p>{{ msgText }} 
     <i class="fa fa-check"></i>
     <i class="fa fa-check"></i>
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
    timeStamp: {}
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
.msg {
  display: flex;
  margin: 5px 0;
}
.mymsg {
  flex-direction: row-reverse;
}
img {
  width: 48px;
  border-radius: 50%;
  align-self: start;
}
p {
  margin: 0;
  font-size: 16px;
  min-height: 48px;
  padding: 10px 10px;
  background-color: $offWhite;
  border-radius: 32px;
  max-width: 70%;
  word-break: break-all;
}
.fa-check{
  display: absolute;
  right: 0;
}
.fa-check:nth-child(2){
  right: 5px;
}
</style>
