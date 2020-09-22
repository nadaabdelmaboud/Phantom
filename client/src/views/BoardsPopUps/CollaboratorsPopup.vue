<template>
  <div id="add" @click="editPopup">
    <div class="addCollab">
      <h3>Invite Collaborators</h3>
      <div class="collabCard" v-if="board.type == 'creator'">
        <label v-if="collaborators.length">
          Collaborators can...
        </label>
        <label v-if="!collaborators.length">
          No Collaborators for this board yet...
        </label>
        <CallaboratorsCard
          v-for="c in collaborators"
          :key="c.id"
          :id="c.id"
          :imageId="c.imageId"
          :collabName="c.name"
          :savePin="c.savePin"
          :createPin="c.createPin"
          :editTitle="c.editTitle"
          :personalization="c.personalization"
          :editDescription="c.editDescription"
          :addCollaborators="c.addCollaborators"
        />
      </div>
      <div style="margin-top:10px">
        <input
          :value="'https://phantomclient.herokuapp.com' + $route.path"
          id="boardLink"
          readonly
        />
        <button id="copyLink" @click="copyLink">Copy link</button>
      </div>
      <div class="confirmCopy" v-if="copied">Copied to the clipboard</div>

      <div
        class="followerInfo"
        v-for="follower in followers"
        :key="follower._id"
      >
        <div
          v-if="
            !collaborators.some(c => c.id === follower._id) &&
              !(board.board.creator.id === follower._id)
          "
        >
          <img :src="getImage(follower.profileImage)" />
          <span>{{ follower.firstName }} </span>
          <span>{{ follower.lastName }}</span>
          <button class="editButton" @click="addCollaborator(follower._id)">
            Invite
          </button>
        </div>
      </div>

      <div class="followerInfo" v-for="f in following" :key="f._id">
        <div
          v-if="
            !collaborators.some(c => c.id === f._id) &&
              !followers.some(follower => follower._id === f._id) &&
              !(board.board.creator.id === f._id)
          "
        >
          <img :src="getImage(f.profileImage)" />
          <span>{{ f.firstName }} </span>
          <span>{{ f.lastName }}</span>
          <button class="editButton" @click="addCollaborator(f._id)">
            Invite
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CallaboratorsCard from "./CollaboratorsCard";
import { default as getImage } from "../../mixins/getImage";

export default {
  name: "CollaboratorsPopup",
  mixins: [getImage],
  data: function() {
    return {
      copied: false
    };
  },
  components: {
    CallaboratorsCard
  },
  methods: {
    editPopup(event) {
      if (event.target.id == "add") {
        this.$store.commit("popUpsState/toggleCollaboratorsPopup");
      }
    },
    copyLink() {
      this.copied = true;
      var copyText = document.getElementById("boardLink");
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      document.execCommand("copy");
      setTimeout(() => {
        this.copied = false;
      }, 3000);
    },
    addCollaborator(id) {
      this.$store.dispatch("boards/editBoard", { collaboratores: id });
    }
  },
  computed: {
    ...mapGetters({
      collaborators: "boards/collaborators",
      followers: "followers/userFollowers",
      following: "followers/userFollowing",
      board: "boards/currentBoard"
    })
  },
  mounted() {
    this.$store.dispatch("boards/getCollaborators");
    this.$store.dispatch("followers/getFollowers");
    this.$store.dispatch("followers/getFollowing");
  },
  created() {}
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/Mixins";
@import "../../scss/GlobalPopup";

#add {
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 12;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.addCollab {
  margin: 50px auto;
  background-color: white;
  width: 450px;
  padding: 20px;
  border-radius: 32px;
  max-height: 75vh;
  overflow-y:auto;
}

  @media screen and (max-width: 500px) {
   .addCollab {
      margin: 50px auto;
      width: 97%;
    }
   }
h3 {
  width: 100%;
  text-align: center;
}
.collabCard {
  max-height: 550px;
  overflow-y: auto;
}
#boardLink {
  width: 65%;
  height: 48px;
  margin-top: 3px;
  font-size: 12px;
  border: $powderBlue solid 2px;
  border-radius: 16px;
  padding: 0 12px;
  transition: linear 0.5s;
  color: $darkBlue;
}
#copyLink {
  color: $darkBlue;
  background-color: $powderBlue;
  width: 33%;
  padding: 5px;
  transition: background-color linear 0.5s;
}
#copyLink:hover {
  background-color: $lightBlue;
}
#copyLink:active {
  transform: scale(0.96);
}
.confirmCopy {
  position: fixed;
  top: 650px;
  left: 45%;
  animation: pop 0.5s linear, fade 1s linear 2s;
  height: 68px;
  background-color: black;
  color: white;
  width: 200px;
  text-align: center;
  border-radius: 32px;
  padding: 20px 0;
}
@keyframes pop {
  0% {
    top: 1000px;
  }
  100% {
    top: 650px;
  }
}
@keyframes fade {
  0% {
  }
  100% {
    transform: scale(1.1);
    opacity: 0;
  }
}
.followerInfo {
  margin: 7px 0;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}
</style>
