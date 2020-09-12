<template>
  <div>
    Boards
  </div>
</template>

<script>
import { default as getImage } from "../../mixins/getImage";
export default {
  name: "NotificationBoards",
  data: function() {
    return {};
  },
  mixins: [getImage]
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
</style>
