<template>
  <div>
    <NavBar />
    <div class="main-content">
      <div class="col col1">
        <router-link class="icons" to="/UserProfile/Boards">
          <i class="fa fa-arrow-left"></i>
        </router-link>
      </div>
      <div class="col col2">
        <SideBar />
      </div>
      <div class="col col3">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "./../components/HomeNavigationBar";
import SideBar from "./../components/UserSettings/EditProfileSideBar";
export default {
  components: {
    NavBar,
    SideBar
  }
};
</script>

<style scoped>
.main-content {
  padding-top: 30px;
  padding-left: 10px;
  display: flex;
}

.col1 {
  width: 20vw;
  max-width: 300px;
}

.col2 {
  width: 10vw;
  max-width: 250px;
}

.col3 {
  width: 60vw;
  min-width: 300px;
}

a {
  color: grey;
}

a:hover {
  color: darkgrey;
}
</style>
