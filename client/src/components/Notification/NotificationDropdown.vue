<template>
  <div class="notificationBody" id="mydiv">
    <NotificationCard />
  </div>
</template>

<script>
//import { default as getImage } from "../mixins/getImage";
//import { mapGetters } from "vuex";
import NotificationCard from "./NotificationCard";
export default {
  name: "BoardPins",
  data: function() {
    return {
      notify: null
    };
  },
  components: {
    NotificationCard
  },
  computed: {},
  created() {},
  mounted() {
    this.notify = document.getElementsByClassName("notificationBody")[0];
    console.log(this.notify);
  },
  beforeDestroy() {
    this.notify.classList.add("away");
  },
  destroyed() {
    console.log("going away");
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";

.notificationBody {
  height: calc(-179px + 100vh);
  width: 360px;
  margin-top: 171px;
  box-shadow: rgba(0, 0, 0, 0.1) -3px 4px 14px 0px;
  overscroll-behavior: none;
  background-color: #fff;
  position: fixed;
  border-radius: 16px;
  right: 8px;
  bottom: 88px;
  animation: dropDown 0.1s linear forwards;
  z-index: 100;
  padding: 20px;
}
.away {
  animation: away 10ms linear forwards;
}
@keyframes dropDown {
  from {
    bottom: 168px;
  }
  to {
    bottom: 88px;
  }
}
@keyframes away {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
