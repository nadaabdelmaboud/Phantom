<template>
  <div id="add" @click="editPopup">
    <div class="addCollab">
      <h3>Invite Collaborators</h3>
      <div class="collabWrapper">
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
            :google="c.google"
            :googleImage="c.googleImage"
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

        <input
          class="searchInput"
          type="text"
          v-model="searchWord"
          placeholder="Search"
          @input="searchFor"
        />
        <div class="searchList" v-if="searchWord">
          <div class="searchBox" @scroll="getPeople">
            <div v-for="(s, i) in peopleSearch" :key="i">
              <div
                v-if="
                  !collaborators.some(c => c.id === s._id) &&
                    !followers.some(follower => follower._id === s._id) &&
                    !(board.board.creator.id === s._id) &&
                    !following.some(f => f._id === s._id)
                "
              >
                <CollaboratorsToAdd
                  :imageId="s.profileImage"
                  :firstName="s.firstName"
                  :lastName="s.lastName"
                  :id="s._id"
                  :google="s.google"
                  :googleImage="s.googleImage"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-for="follower in followers" :key="follower._id">
          <div
            v-if="
              !collaborators.some(c => c.id === follower._id) &&
                !(board.board.creator.id === follower._id)
            "
          >
            <CollaboratorsToAdd
              :imageId="follower.profileImage"
              :firstName="follower.firstName"
              :lastName="follower.lastName"
              :id="follower._id"
              :google="follower.google"
              :googleImage="follower.googleImage"
            />
          </div>
        </div>

        <div v-for="(f, i) in following" :key="i">
          <div
            v-if="
              !collaborators.some(c => c.id === f._id) &&
                !followers.some(follower => follower._id === f._id) &&
                !(board.board.creator.id === f._id)
            "
          >
            <CollaboratorsToAdd
              :imageId="f.profileImage"
              :firstName="f.firstName"
              :lastName="f.lastName"
              :id="f._id"
              :google="f.google"
              :googleImage="f.googleImage"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import CallaboratorsCard from "./CollaboratorsCard";
import CollaboratorsToAdd from "./CollaboratorsToAdd";

export default {
  name: "CollaboratorsPopup",
  data: function() {
    return {
      copied: false,
      searchWord: ""
    };
  },
  components: {
    CallaboratorsCard,
    CollaboratorsToAdd
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
    searchFor() {
      if (this.searchWord) {
        this.$store.commit("search/resetOffset");
        this.$store.dispatch("search/searchPeople", {
          name: this.searchWord,
          recentSearch: false
        });
      } else {
        this.$store.commit("search/resetOffset");
      }
    },
    getPeople() {
      let searchBox = document.getElementsByClassName("searchBox")[0];
      if (searchBox.scrollTop == searchBox.scrollHeight - 300) {
        this.$store.dispatch("search/searchPeople", {
          name: this.searchWord,
          recentSearch: false
        });
      }
    }
  },
  computed: {
    ...mapGetters({
      collaborators: "boards/collaborators",
      followers: "followers/userFollowers",
      following: "followers/userFollowing",
      board: "boards/currentBoard"
    }),
    ...mapState({
      peopleSearch: state => state.search.people
    })
  },
  mounted() {
    this.$store.dispatch("boards/getCollaborators");
    this.$store.dispatch("followers/getFollowers");
    this.$store.dispatch("followers/getFollowing");
    this.$store.commit("search/resetOffset");
  },
  created() {}
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/Mixins";
@import "../../scss/GlobalPopup";
@import "../../scss/CollaboratorsPopup";
</style>
