<template>
  <div class="profile" @click="clear">
    <div class="profileInfo">
      <img :src="getImage(imageId)" />
      <h1>{{ userName }}</h1>
      <h6>{{ followers }} following</h6>
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
    <div class="stickyBar row  m-0">
      <div class="col-sm-4 col-4 col1">
        <router-link
          to="/settings"
          tag="i"
          class="fa fa-pencil"
          aria-hidden="true"
        ></router-link>
        <i class="fa fa-upload" aria-hidden="true"></i>
      </div>
      <div class="col-sm-4 col-4 col2">
        <router-link
          class="buttons"
          to="/UserProfile/Boards"
          tag="div"
          :class="{ inRoute: inBoards }"
        >
          Boards
        </router-link>
        <router-link
          class="buttons"
          to="/UserProfile/Pins"
          tag="div"
          :class="{ inRoute: inPins }"
        >
          Pins
        </router-link>
      </div>
      <div class="col-sm-4 col-4 col3">
        <i
          class="fa fa-plus"
          aria-hidden="true"
          id="create"
          style="float:right;"
          @click="showCreate = !showCreate"
        ></i>
        <i
          class="fa fa-list"
          aria-hidden="true"
          id="view"
          style="float:right;"
          @click="showViewOptions = !showViewOptions"
        ></i>
      </div>
    </div>
    <div class="create view" v-if="showViewOptions">
      <p>Sort by</p>
      <ul>
        <li @click="sortAz">A to Z</li>
        <li>Drag and drop</li>
        <li @click="sortDate">Last saved to</li>
      </ul>
      <p>View options</p>
      <ul>
        <li>Default</li>
        <li>Compact</li>
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
      inBoards: true,
      inPins: false,
      showCreate: false,
      showViewOptions: false,
      myprofile: false,
      userName: "",
      imageId: "",
      followers: ""
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
    alterFollow() {
      let userId = this.$route.params.userId;
      if (this.isFollowed) {
        this.$store.dispatch("followers/unfollowUser", userId);
      } else {
        this.$store.dispatch("followers/followUser", userId);
      }
    }
  },
  computed: {
    ...mapGetters({
      user: "phantomUser/user",
      isFollowed: "phantomUser/isFollowed"
    }),
    ...mapState({
      meUser: state => state.user.userData
    })
  },
  watch: {
    $route: function() {
      if (this.$route.path == "/UserProfile/Pins") {
        this.inBoards = false;
        this.inPins = true;
      } else if (this.$route.path == "/UserProfile/Boards") {
        this.inBoards = true;
        this.inPins = false;
      } else {
        this.inBoards = false;
        this.inPins = false;
      }
    }
  },
  created() {
    this.myprofile = this.$route.path.includes("/UserProfile");
    if (!this.myprofile) {
      let userId = this.$route.params.userId;
      this.$store.dispatch("phantomUser/getUser", userId);
      this.$store.dispatch("phantomUser/isFollowed", userId);
    } else {
      this.$store.dispatch("user/getUserProfile");
    }
  },
  mounted() {
    setTimeout(() => {
      if (!this.myprofile) {
        this.userName = this.user.firstName + " " + this.user.lastName;
        this.imageId = this.user.profileImage;
        this.followers = this.user.followers.length;
      } else {
        this.userName = this.meUser.userName;
        this.imageId = this.meUser.profileImage;
        this.followers = this.meUser.followers.length;
      }
    }, 4000);
  }
};
</script>

<style lang="scss" scoped>
@import "../scss/Colors";
@import "../scss/mixins";
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
</style>
