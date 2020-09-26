<template>
  <div class="navigationBar">
    <router-link class="icons" to="/" tag="div">
      <i class="fa fa-pinterest"></i>
    </router-link>
    <div
      class="buttons small inRoute"
      v-if="isLoggedIn() && searchSmall"
      id="homeNavSmall"
    >
      {{ currentRoute }} <i class="fa fa-sort-down" id="homeNavSmall"></i>
    </div>

    <div class="create navList" v-if="navList">
      <ul>
        <router-link to="/" tag="li"
          ><i v-if="inHome" class="fa fa-check"></i> Home</router-link
        >
        <router-link to="/following" tag="li"
          ><i v-if="inFollowing" class="fa fa-check"></i> Following</router-link
        >
      </ul>
    </div>

    <router-link
      class="buttons big"
      to="/"
      tag="div"
      :class="{ inRoute: inHome }"
      v-if="isLoggedIn()"
    >
      Home
    </router-link>
    <router-link
      class="buttons big"
      to="/following"
      tag="div"
      :class="{ inRoute: inFollowing }"
      v-if="isLoggedIn()"
    >
      Following
    </router-link>
    <input
      class="searchInput"
      v-if="isLoggedIn()"
      placeholder=" Search..."
      @input="searchInput"
      v-model="search"
      v-on:keyup.enter="searchEnter"
    />
    <i
      class="fa fa-close clear-icon"
      @click="clearSearch"
      :class="{ lefted_icon: this.showFilter }"
      v-if="isLoggedIn() && (search || !searchSmall)"
    ></i>
    <div class="bar" v-if="showFilter"></div>
    <p class="filter" v-if="showFilter" @click="expandMenu = !expandMenu">
      {{ selectedFilter }}
    </p>
    <i
      class="fa fa-angle-down expand-menu-icon"
      v-if="showFilter"
      @click="expandMenu = !expandMenu"
    ></i>
    <div class="menu" v-if="expandMenu && showFilter">
      <ul>
        <li @click="searchPins">All Pins</li>
        <li @click="searchMyPins">My Pins</li>
        <li @click="searchPeople">People</li>
        <li @click="searchBoards">Boards</li>
      </ul>
    </div>
    <div class="icons rightIcon arrow" v-if="isLoggedIn()" id="showList">
      <i class="fa fa-angle-down" id="showList"></i>
    </div>

    <router-link
      v-if="isLoggedIn()"
      tag="div"
      class="icons rightIcon"
      to="/UserProfile/Boards"
    >
      <i class="fa fa-user-circle"></i>
    </router-link>
    <div v-if="isLoggedIn()" class="icons rightIcon" id="alertIcon">
      <i class="fa fa-bell" id="alertIcon"></i>
      <div class="count" id="alertIcon">
        {{ notification.notificationCounter }}
      </div>
    </div>
    <NotificationDropDown v-if="showNotifications" />
    <div
      v-if="isLoggedIn() && searchSmall"
      class="icons searchSmall rightIcon"
      @click="showSearch"
    >
      <i class="fa fa-search"></i>
    </div>
    <router-link
      class="buttons right"
      to="/signUp"
      tag="div"
      v-if="!isLoggedIn()"
    >
      SignUp</router-link
    >
    <router-link
      class="buttons inRoute right"
      to="/Login"
      tag="div"
      v-if="!isLoggedIn()"
      >LogIn</router-link
    >
    <div class="create view" v-if="showList">
      <ul>
        <li @click="toSetting">Settings</li>
        <li @click="toTopicsPage">tune your home feed</li>
        <li @click="logout">Logout</li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/Colors";
@import "../scss/Mixins";

.navigationBar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  // bottom: 80px;
  height: 80px;
  width: 100vw;
  padding: 16px 10px;
  background-color: $offWhite;
  z-index: 11;
}
.buttons {
  @include horizontalDivs;
  border-radius: 40px;
  font-size: 16px;
  font-weight: 700;
  padding: 12px;
}
.searchInput {
  display: table-cell;
  background-color: $lightPink;
  height: 48px;
  margin-top: 4px;
  width: calc(100vw - 448px);
  border: none;
  padding: 10px;
  border-radius: 40px;
  transition: background-color 0.5s ease;
}
.searchInput:hover {
  background-color: $lightPinkHover;
}
.searchInput:focus {
  background-color: $lightPinkHover;
  border: $lightBlue 4px solid;
  outline: none;
}
.icons {
  @include horizontalDivs;
  width: 48px;
  border-radius: 50%;
  i {
    font-size: 20px;
  }
}
.rightIcon {
  float: right;
  margin-right: 10px;
}
.inRoute {
  background-color: $darkBlue;
  color: $lightPink;
}
.inRoute:hover {
  background-color: $darkBlue;
  color: $lightPink;
}
.right {
  float: right;
  margin: 0px 10px;
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
  right: 30px;
}
.navList {
  left: 40px;
  top: 70px;
}
.count {
  display: inline-block;
  font-size: 12px;
  // color:$lightPink ;
  background-color: $offWhite;
  min-height: 16px;
  min-width: 16px;
  //padding-top: 2px;
  border-radius: 50%;
  margin-left: -8px;
  position: absolute;
  top: 30px;
  animation: pop 1s linear;
}
.icons:hover {
  .count {
    transform: scale(1.1);
  }
  .fa-bell {
    animation: ring 0.75s linear infinite;
  }
}
.fa-bell {
  transform: rotateZ(25deg);
}
@keyframes pop {
  50% {
    transform: scale(1.1);
  }
}
@keyframes ring {
  0% {
    transform: rotateZ(25deg);
  }
  25% {
    transform: rotateZ(0deg);
  }
  50% {
    transform: rotateZ(-25deg);
  }
  75% {
    transform: rotateZ(0deg);
  }
}

.clear-icon {
  background-position: center center;
  background-repeat: no-repeat;
  border: none;
  background-color: transparent;
  cursor: pointer;
  position: relative;
  top: -2px;
  left: -20px;
}

.bar {
  width: 2px;
  height: 20px;
  background-color: $queenBlue;
  background-position: center center;
  border: none;
  position: relative;
  top: 3px;
  left: -110px;
  display: inline-block;
}

.filter {
  display: inline-block;
  font-weight: bold;
  font-size: 12px;
  position: fixed;
  top: 36px;
  right: 255px;
  cursor: pointer;
}

.expand-menu-icon {
  border: none;
  background-color: transparent;
  cursor: pointer;
  position: fixed;
  top: 36px;
  right: 235px;
}

.menu {
  @include optionsList;
  padding: 10px;
  width: 120px;
  right: calc(100vw - 85vw);
  font-size: 12px;
}
@media screen and (max-width: 6500px) {
  .lefted_icon {
    left: -120px;
  }
}
.small {
  display: none;
}
.searchSmall {
  display: none;
}
@media screen and (max-width: 950px) {
  .lefted_icon {
    left: -44px;
  }

  .bar,
  .filter,
  .expand-menu-icon,
  .menu {
    display: none;
  }
  .big {
    display: none;
  }
  .small {
    display: inline-block;
    font-size: 14px;
    height: 40px;
    padding: 8px;
  }
  .searchInput {
    height: 40px;
    width: calc(100vw - 320px);
  }
  .icons {
    width: 40px;
    height: 40px;
    padding: 8px 4px;
    i {
      font-size: 16px;
    }
  }
}

@media screen and (max-width: 400px) {
  .searchInput {
    display: none;
    width: calc(100vw - 180px);
  }
  .icons {
    width: 30px;
    height: 30px;
    padding: 2px 4px;
    i {
      font-size: 16px;
    }
  }
  .searchSmall {
    display: inline-block;
  }
  .rightIcon {
    margin-right: 0px;
  }
  .arrow {
    margin-right: 10px;
  }
}
</style>
<script>
import NotificationDropDown from "./Notification/NotificationDropdown";
import isLoggedIn from "../mixins/isLoggedIn.js";
import removeUser from "../mixins/removeUserData.js";
import { mapGetters, mapState } from "vuex";
export default {
  name: "HomeNavigationBar",
  data: function() {
    return {
      inHome: true,
      inFollowing: false,
      showFilter: false,
      search: "",
      selectedFilter: "All Pins",
      expandMenu: false,
      currentRoute: "Home",
      searchSmall: true
    };
  },
  components: {
    NotificationDropDown
  },
  mixins: [isLoggedIn, removeUser],
  methods: {
    logout() {
      this.removeUserData();
    },
    toSetting() {
      this.$router.push("/settings");
    },
    toTopicsPage() {
      this.$router.push("/TopicsPage");
    },
    searchInput() {
      if (!this.$store.state.popUpsState.searchSuggestions)
        this.$store.commit("popUpsState/toggleSearchSuggestions");
      if (this.search) {
        this.$store.dispatch("search/searchKeywords", this.search);
        this.$store.dispatch("search/searchPeople", {
          name: this.search,
          recentSearch: false,
          searchSuggestions: true
        });
      }
    },
    clearSearch() {
      this.search = "";
      if (!this.searchSmall) {
        this.searchSmall = true;
        let searchInput = document.getElementsByClassName("searchInput")[0];
        searchInput.style.display = "none";
      }
      if (this.$store.state.popUpsState.searchSuggestions)
        this.$store.commit("popUpsState/toggleSearchSuggestions");
    },
    showSearch() {
      this.searchSmall = false;
      let searchInput = document.getElementsByClassName("searchInput")[0];
      searchInput.style.display = "table-cell";
    },
    searchEnter() {
      this.$store.commit("search/resetOffset");
      if (this.search) {
        this.$store.dispatch("search/searchPins", {
          limit: 10,
          name: this.search
        });
        this.$router.replace(`/search/allpins/${this.search}`);
        if (this.$store.state.popUpsState.searchSuggestions)
          this.$store.commit("popUpsState/toggleSearchSuggestions");
      }
    },
    searchPins() {
      this.expandMenu = false;
      this.$router.replace(`/search/allpins/${this.search}`);
      this.$store.dispatch("search/searchPins", {
        limit: 10,
        name: this.search
      });
    },
    searchMyPins() {
      this.expandMenu = false;
      this.$router.replace(`/search/mypins/${this.search}`);
      this.$store.dispatch("search/searchMyPins", {
        limit: 10,
        name: this.search
      });
    },
    searchPeople() {
      this.expandMenu = false;
      this.$router.replace(`/search/people/${this.search}`);
      this.$store.dispatch("search/searchPeople", {
        limit: 10,
        name: this.search
      });
    },
    searchBoards() {
      this.expandMenu = false;
      this.$router.replace(`/search/boards/${this.search}`);
      this.$store.dispatch("search/searchBoards", {
        limit: 20,
        offset: 0,
        name: this.search
      });
    },
    handleRoute() {
      if (this.$route.path == "/") {
        this.inFollowing = false;
        this.inHome = true;
        this.showFilter = false;
        this.currentRoute = "Home";
      } else if (this.$route.path == "/following") {
        this.inHome = false;
        this.inFollowing = true;
        this.currentRoute = "following";
      } else if (this.$route.name == "SearchPins" && this.isLoggedIn()) {
        this.showFilter = true;
        this.selectedFilter = "All Pins";
        this.search = this.$route.params.name;
      } else if (this.$route.name == "SearchMyPins" && this.isLoggedIn()) {
        this.showFilter = true;
        this.selectedFilter = "My Pins";
        this.search = this.$route.params.name;
      } else if (this.$route.name == "SearchPeople" && this.isLoggedIn()) {
        this.showFilter = true;
        this.selectedFilter = "People";
        this.search = this.$route.params.name;
      } else if (this.$route.name == "SearchBoards" && this.isLoggedIn()) {
        this.showFilter = true;
        this.selectedFilter = "Boards";
        this.search = this.$route.params.name;
      } else {
        this.inHome = false;
        this.inFollowing = false;
        this.showFilter = false;
        this.currentRoute = "Home";
      }
    }
  },
  computed: {
    ...mapGetters({
      notification: "notifications/notifications",
      showNotifications: "notifications/show"
    }),
    ...mapState({
      navList: state => state.popUpsState.navList,
      showList: state => state.popUpsState.showList
    })
  },
  watch: {
    $route: function() {
      this.handleRoute();
    }
  },
  mounted: function() {
    this.handleRoute();
  }
};
</script>
