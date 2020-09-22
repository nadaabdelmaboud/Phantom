<template>
  <div class="profile" @click="clear">
    <div class="profileInfo">
      <img v-if="myprofile" :src="getImage(this.meUser.profileImage)" />
      <img v-else :src="getImage(this.user.profileImage)" />
      <h1 v-if="myprofile">{{ this.meUser.userName }}</h1>
      <h1 v-else>{{ this.user.userName }}</h1>
      <h6 v-if="myprofile">{{ this.meUser.followers.length }} following</h6>
      <h6 v-else>{{ this.user.followers }} following</h6>
      <div
        class="buttons inRoute follow"
        v-if="!myprofile && !isFollowed"
        @click="alterFollow"
      >
        follow
      </div>
      <div
        class="buttons inRoute follow unfollow"
        v-if="!myprofile && isFollowed"
        @click="alterFollow"
      >
        unfollow
      </div>
    </div>
    <div class="stickyBar flexBar">
      <div class="flexBar">
        <router-link
          to="/settings"
          tag="i"
          class="fa fa-pencil"
          aria-hidden="true"
          v-if="myprofile"
        ></router-link>
      </div>
      <div class="flexBar">
        <div class="buttons" @click="toBoards" :class="{ inRoute: inBoards }">
          Boards
        </div>
        <div class="buttons" @click="toPins" :class="{ inRoute: inPins }">
          Pins
        </div>
      </div>
      <div class="flexBar flexEnd">
        <i
          class="fa fa-list"
          aria-hidden="true"
          id="view"
          style="float:right;"
          @click="showViewOptions = !showViewOptions"
          v-if="myprofile"
        ></i>
        <i
          class="fa fa-plus"
          aria-hidden="true"
          id="create"
          style="float:right;"
          @click="showCreate = !showCreate"
        ></i>
      </div>
    </div>
    <div class="create view" v-if="showViewOptions">
      <p>Sort by</p>
      <ul>
        <li @click="sortAz">
          <i
            class="fa fa-check"
            v-if="meUser.sortType == 'A-Z'"
            aria-hidden="true"
          ></i>
          A to Z
        </li>
        <li @click="reorder">
          <i
            class="fa fa-check"
            v-if="meUser.sortType == 'Reorder'"
            aria-hidden="true"
          ></i>
          Drag and drop
        </li>
        <li @click="sortDate">
          <i
            class="fa fa-check"
            aria-hidden="true"
            v-if="meUser.sortType == 'Date'"
          ></i>
          Last saved to
        </li>
      </ul>
      <p>View options</p>
      <ul>
        <li @click="alterView('Default')">
          <i
            class="fa fa-check"
            aria-hidden="true"
            v-if="viewState == 'Default'"
          ></i>
          Default
        </li>
        <li @click="alterView('Compact')">
          <i
            class="fa fa-check"
            aria-hidden="true"
            v-if="viewState == 'Compact'"
          ></i>
          Compact
        </li>
      </ul>
    </div>
    <div class="create" v-if="showCreate">
      <p>Create</p>
      <ul>
        <li @click="createBoardPopup">Board</li>
        <router-link tag="li" to="/PinBuilder">Pin</router-link>
      </ul>
    </div>
    <router-view> </router-view>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import getImage from "../mixins/getImage.js";
export default {
  name: "UserProfile",
  data: function() {
    return {
      inBoards: false,
      inPins: false,
      showCreate: false,
      showViewOptions: false,
      myprofile: false,
      userId: ""
    };
  },
  mixins: [getImage],
  methods: {
    clear(event) {
      if (event.target.id != "create") {
        this.showCreate = false;
      }
      if (event.target.id != "view") {
        this.showViewOptions = false;
      }
    },
    createBoardPopup() {
      this.$store.commit("popUpsState/toggleCreateBoardPopup");
    },
    sortAz() {
      this.$store.dispatch("boards/sortAz");
    },
    sortDate() {
      this.$store.dispatch("boards/sortDate");
    },
    reorder() {
      this.$store.dispatch("boards/reorderBoards", {
        from: 0,
        to: 1
      });
    },
    alterFollow() {
      if (this.isFollowed) {
        this.$store.dispatch("followers/unfollowUser", this.userId);
      } else {
        this.$store.dispatch("followers/followUser", this.userId);
      }
    },
    toBoards() {
      if (this.myprofile) this.$router.push("/UserProfile/Boards");
      else this.$router.push("/User/" + this.userId);
      this.inBoards = true;
      this.inPins = false;
    },
    toPins() {
      if (this.myprofile) this.$router.push("/UserProfile/Pins");
      else this.$router.push("/User/" + this.userId + "/Pins");
      this.inPins = true;
      this.inBoards = false;
    },
    alterView(view) {
      this.$store.dispatch("boards/setViewState", view);
    }
  },
  computed: {
    ...mapGetters({
      user: "phantomUser/user",
      isFollowed: "phantomUser/isFollowed",
      viewState: "boards/viewState"
    }),
    ...mapState({
      meUser: state => state.user.userData
    })
  },
  created() {
    this.myprofile = this.$route.path.includes("/UserProfile");
    if (!this.myprofile) {
      this.userId = this.$route.params.userId;
      if (!this.user || this.userId != this.user._id) {
        this.$store.dispatch("phantomUser/getUser", this.userId);
        this.$store.dispatch("phantomUser/isFollowed", this.userId);
      }
    }
  },
  mounted() {
    if (this.$route.path.includes("/Pins")) {
      this.inBoards = false;
      this.inPins = true;
    } else {
      this.inBoards = true;
      this.inPins = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../scss/Colors";
@import "../scss/Mixins";

.profileInfo {
  margin-bottom: 40px;
  img {
    width: 120px;
    border-radius: 50%;
    margin: 10px calc((100vw - 120px) / 2);
    height: 120px;
  }
}
h1,
h6 {
  text-align: center;
  font-weight: 700;
}
h1 {
  font-size: 36px;
}
h6 {
  font-size: 16px;
}
.stickyBar {
  background-color: $offWhite;
  height: 68px;
  position: sticky;
  top: 80px;
  z-index: 10;
  padding: 6px 0;
}
i {
  height: 48px;
  width: 48px;
  font-size: 24px;
  color: $darkBlue;
  border-radius: 50%;
  padding: 12px;
  text-align: center;
  transition: background-color 0.5s ease;
  cursor: pointer;
}
i:hover {
  background-color: $lightPink;
}
@media screen and (max-width: 350px) {
  i {
    height: 40px;
    width: 40px;
    padding: 6px;
  }
}
.fa-check {
  height: 24px;
  width: 24px;
  font-size: 16px;
  color: black;
  padding: 4px 0;
  text-align: center;
  cursor: pointer;
}
.fa-check:hover {
  background-color: transparent;
}
.col2 {
  padding: 0 60px;
}
.buttons {
  @include horizontalDivs;
  border-radius: 40px;
  font-size: 16px;
  font-weight: 700;
  padding: 12px;
  margin: 0 5px;
}
.inRoute {
  background-color: $darkBlue;
  color: $lightPink;
}
.inRoute:hover {
  background-color: $darkBlue;
  color: $lightPink;
}
.follow {
  display: block;
  width: 100px;
  margin: 15px auto;
}
.unfollow {
  background-color: $lightPink;
  color: $darkBlue;
}
.unfollow:hover {
  background-color: $lightPink;
  color: $darkBlue;
}
.create {
  @include optionsList;
  padding: 10px;
  width: 200px;
  right: 30px;
  p {
    font-size: 12px;
  }
}
.view {
  right: 80px;
}
.flexBar {
  display: flex;
  width: 100%;
}
.flexEnd {
  justify-content: flex-end;
}
</style>
