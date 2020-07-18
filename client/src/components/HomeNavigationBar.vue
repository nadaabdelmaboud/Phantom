<template>
  <div class="navigationBar">
    <router-link class="icons" to="/" tag="div">
      <i class="fa fa-pinterest"></i>
    </router-link>
    <router-link class="buttons" to="/" tag="div" :class="{ inRoute: inHome }">
      Home
    </router-link>
    <router-link
      class="buttons"
      to="/following"
      tag="div"
      :class="{ inRoute: inFollowing }"
    >
      Following
    </router-link>
    <input class="searchInput" placeholder=" Search..." />
    <div class="icons">

      <i class="fa fa-bell"></i>
    </div>
    <router-link tag="div" class="icons" to="/UserProfile/Boards">
      <i class="fa fa-user-circle" ></i> 
    </router-link>
    <div class="icons">
      <i class="fa fa-angle-down"></i>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/Colors";
@import "../scss/Mixins";

.navigationBar {
  position: fixed;
  top:0;
  right: 0;
  left:0;
 // bottom: 80px;
  height: 80px;
  width: 100vw;
  padding: 16px 0;
  background-color: $offWhite;
  z-index: 1;
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
</style>
<script>
export default {
  name: "HomeNavigationBar",
  data: function() {
    return {
      inHome: true,
      inFollowing: false
    };
  },
  watch: {
    $route: function() {
      if (this.$route.path == "/") {
        this.inFollowing = false;
        this.inHome = true;
      } 
      else if (this.$route.path == "/following") {
        this.inHome = false;
        this.inFollowing = true;
      }
      else{
         this.inHome = false;
         this.inFollowing = false;
      }
    }
  }
};
</script>
