<template>
  <div class="notificationBody" id="mydiv">
    <div class="scroll">
      <div v-for="n in notifications.notifications" :key="n" class="">
        <NotificationPinsCard
          v-if="n.pins"
          :imageIds="n.images"
          :title="n.title"
          :body="n.body"
        />
        <NotificationActionsCard
          v-else
          :imageId="n.followerImageId"
          :id="n.followerId"
          :title="n.title"
          :body="n.body"
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
  data: function() {
    return {};
  },
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
    this.$store.dispatch("notifications/getNotifications");
    this.$store.dispatch("notifications/resetCounter");
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
