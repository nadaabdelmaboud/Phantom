<template>
  <div class="notificationBody" id="mydiv">
    <div class="scroll">
      <div v-for="n in notifications.notifications" :key="n.time" class="">
        <NotificationPinsCard
          v-if="n.isPins"
          :imageIds="n.images"
          :title="n.title"
          :body="n.body"
          :pins="n.pins"
          :boards="n.boards"
        />
        <NotificationActionsCard
          v-else
          :imageId="n.followerImageId"
          :followerId="n.followerId"
          :pinId="n.pinId"
          :title="n.title"
          :body="n.body"
          :google="n.google == 'true'"
          :googleImage="n.googleImage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import NotificationPinsCard from "./NotificationPinsCard";
import NotificationActionsCard from "./NotificationActionsCard";
import { mapGetters } from "vuex";
export default {
  name: "BoardPins",
  components: {
    NotificationPinsCard,
    NotificationActionsCard
  },
  computed: {
    ...mapGetters({
      notifications: "notifications/notifications"
    })
  },
  created() {
    this.$store.dispatch("notifications/getNotifications", false);
    this.$store.dispatch("user/updateUserSettings", {
      notificationCounter: 0
    });
    this.$store.commit("notifications/setCounter", 0);
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
  background-color: #fff;
  position: fixed;
  border-radius: 16px;
  right: 8px;
  bottom: 88px;
  animation: dropDown 0.1s linear forwards;
  z-index: 100;
  padding: 20px;
  max-width: 90vw;
}
.flexWrap {
  display: flex;
  flex-direction: column-reverse;
}
.scroll {
  padding: 10px;
  max-height: calc(-219px + 100vh);
  overflow-y: auto;
}
@keyframes dropDown {
  from {
    bottom: 168px;
  }
  to {
    bottom: 88px;
  }
}
</style>
