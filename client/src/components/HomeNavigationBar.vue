<template>
  <div class="navigationBar">
    <router-link class="icons" to="/" tag="div">
      <i class="fa fa-pinterest"></i>
    </router-link>
    <router-link
      class="buttons"
      to="/"
      tag="div"
      :class="{ inRoute: inHome }"
      v-if="isLoggedIn()"
    >
      Home
    </router-link>
    <router-link
      class="buttons"
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
    />
    <i
      class="fa fa-close clear-icon"
      v-if="search"
      @click="clearSearch"
      :class="{ lefted_icon: this.showFilter }"
    ></i>
    <div class="bar" v-if="showFilter"></div>
    <p class="filter" v-if="showFilter">{{ selectedFilter }}</p>
    <i class="fa fa-angle-down expand-menu-icon" v-if="showFilter"></i>
    <div v-if="isLoggedIn()" class="icons" id="alertIcon">
      <i class="fa fa-bell" id="alertIcon"></i>
      <div class="count" id="alertIcon">
        {{ notification.notificationCounter }}
      </div>
    </div>
    <NotificationDropDown v-if="showNotifications" />
    <router-link
      v-if="isLoggedIn()"
      tag="div"
      class="icons"
      to="/UserProfile/Boards"
    >
      <i class="fa fa-user-circle"></i>
    </router-link>
    <div class="icons" v-if="isLoggedIn()" @click="showList = !showList">
      <i class="fa fa-angle-down"></i>
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
      <p>Accounts</p>
      <ul>
        <li>Add another account</li>
      </ul>
      <p>More options</p>
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
  right: 40px;
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
  left: -44px;
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
  position: relative;
  top: -1px;
  left: -100px;
}

.expand-menu-icon {
  border: none;
  background-color: transparent;
  cursor: pointer;
  position: relative;
  top: 0px;
  left: -95px;
}

@media screen and (max-width: 950px) {
  .clear-icon {
    left: -44px;
  }
}
.lefted_icon {
  left: -120px;
}
</style>
<script>
import NotificationDropDown from "./Notification/NotificationDropdown";
import isLoggedIn from "../mixins/isLoggedIn.js";
import removeUser from "../mixins/removeUserData.js";
import { mapGetters } from "vuex";
export default {
  name: "HomeNavigationBar",
  data: function() {
    return {
      inHome: true,
      inFollowing: false,
      showList: false,
      showFilter: false,
      search: "",
      selectedFilter: "All Pins"
    };
  },
  components: {
    NotificationDropDown
  },
  mixins: [isLoggedIn, removeUser],
  methods: {
    logout() {
      this.removeUserData();
      console.log(this.isLoggedIn());
      this.showList = false;
    },
    toSetting() {
      this.showList = false;
      this.$router.push("/settings");
    },
    toTopicsPage() {
      this.showList = false;
      this.$router.push("/TopicsPage");
    },
    searchInput() {
      if (!this.$store.state.popUpsState.searchSuggestions)
        this.$store.commit("popUpsState/toggleSearchSuggestions");
      if (this.search) {
        this.$store.dispatch("search/searchPins", {
          limit: 5,
          offset: 0,
          name: this.search,
          recentSearch: false
        });
        this.$store.dispatch("search/searchPeople", {
          limit: 3,
          offset: 0,
          name: this.search,
          recentSearch: false
        });
      }
    },
    clearSearch() {
      this.search = "";
      if (this.$store.state.popUpsState.searchSuggestions)
        this.$store.commit("popUpsState/toggleSearchSuggestions");
    }
  },
  computed: {
    ...mapGetters({
      notification: "notifications/notifications",
      showNotifications: "notifications/show"
    })
  },
  watch: {
    $route: function() {
      if (this.$route.path == "/") {
        this.inFollowing = false;
        this.inHome = true;
      } else if (this.$route.path == "/following") {
        this.inHome = false;
        this.inFollowing = true;
      } else if (this.$route.path == "/search" && this.isLoggedIn()) {
        this.showFilter = true;
      } else {
        this.inHome = false;
        this.inFollowing = false;
        this.showFilter = false;
      }
    }
  }
};
</script>
