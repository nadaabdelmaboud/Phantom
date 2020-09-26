<template>
  <div class="UserInfo">
    <img :src="getImage(imageId, google, googleImage)" />
    <span>{{ firstName }} </span>
    <span>{{ lastName }}</span>
    <button class="editButton" @click="addCollaborator(id)">
      Invite
    </button>
  </div>
</template>

<script>
import { default as getImage } from "../../mixins/getImage";

export default {
  name: "CollaboratorsToAdd",
  mixins: [getImage],
  data: function() {
    return {};
  },
  props: {
    id: {
      type: String
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    imageId: {
      type: String
    },
    google: {
      type: Boolean
    },
    googleImage: {
      type: String
    }
  },
  methods: {
    addCollaborator(id) {
      this.$store.dispatch("boards/editBoard", { collaboratores: id });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/Mixins";
@import "../../scss/GlobalPopup";

.UserInfo {
  margin: 7px 0;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 5px;
  }
}

@media screen and (max-width: 360px) {
  .UserInfo {
    padding: 2px;
    margin: 4px 0;
    font-size: 12px;
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 2px;
    }
  }
  @media screen and (max-width: 360px) {
    .UserInfo {
      padding: 2px;
      margin: 4px 0;
      font-size: 12px;
      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 2px;
      }
    }
    .editButton {
      padding: 4px;
      height: 30px;
    }
  }
}
</style>
