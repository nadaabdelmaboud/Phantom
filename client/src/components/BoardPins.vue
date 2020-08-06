<template>
  <div>
      Pins
  </div>
</template>

<script>
//import { default as getImage } from "../mixins/getImage";
import {mapGetters} from "vuex"
export default {
  name: "BoardPins",
  data: function() {
    return {
      boardId:""
    }
  },
  computed: {
    ...mapGetters({
      board: "boards/currentBoard"
    }),
  },
  created: function() {
    this.boardId = this.$route.params.boardId;
   // this.$store.dispatch("boards/getBoard", this.$route.params.boardId);
  }

};
</script>

<style lang="scss" scoped>
@import "../scss/Colors";
</style>
