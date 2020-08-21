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
     v-if="isLoggedIn()">
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
    <input class="searchInput" v-if="isLoggedIn()" placeholder=" Search..." />
    <div v-if="isLoggedIn()" class="icons" @click="shownNotification = !shownNotification">
      <i class="fa fa-bell"></i>
    </div>
    <NotificationDropDown v-if="shownNotification"/>
    <router-link v-if="isLoggedIn()" tag="div" class="icons" to="/UserProfile/Boards">
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
     > SignUp</router-link>
     <router-link
      class="buttons inRoute right"
      to="/Login"
      tag="div"
      v-if="!isLoggedIn()"
     >LogIn</router-link>
    <div class="create view" v-if="showList">
      <p>Accounts</p>
      <ul>
        <li>Add another account</li>
      </ul>
      <p>More options</p>
      <ul>
        <li @click="toSetting">Settings</li>
        <li>tune your home feed</li>
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
  width: calc(100vw - 430px);
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
}
.icons {
  @include horizontalDivs;
  width: 48px;
  border-radius: 50%;
  i {
    font-size: 20px;
  }
}
.icons:active,
.icons:focus {
  background-color: red;
}
.inRoute {
  background-color: $darkBlue;
  color: $lightPink;
}
.inRoute:hover {
  background-color: $darkBlue;
  color: $lightPink;
}
.right{
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
</style>
<script>
import NotificationDropDown from "./Notification/NotificationDropdown";
import isLoggedIn from "../mixins/isLoggedIn.js"
import removeUser from "../mixins/removeUserData.js"
export default {
  name: "HomeNavigationBar",
  data: function() {
    return {
      inHome: true,
      inFollowing: false,
      shownNotification:false,
      showList:false
    };
  },
  components:{
    NotificationDropDown
  },
  mixins:[
    isLoggedIn,
    removeUser
  ],
  methods:{
    logout(){
      this.removeUserData();
      console.log(this.isLoggedIn())
      this.showList= false
    },
    toSetting(){
      this.showList=false;
      this.$router.push('/settings')
    }
  },
  watch: {
    $route: function() {
      if (this.$route.path == "/") {
        this.inFollowing = false;
        this.inHome = true;
      } else if (this.$route.path == "/following") {
        this.inHome = false;
        this.inFollowing = true;
      } 
      else {
        this.inHome = false;
        this.inFollowing = false;
      }
    }
  }
};
</script>
