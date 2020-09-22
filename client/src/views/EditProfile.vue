<template>
  <div>
    <div class="main-content">
      <div class="col-4 col1">
        <div class="row">
          <div class="col-12 col-md-6">
            <router-link class="icons" to="/UserProfile/Boards">
              <i class="fa fa-arrow-left"></i>
            </router-link>
          </div>
          <div class="col-12 col-md-6">
            <SideBar />
          </div>
        </div>
      </div>
      <div class="col-sm-8 col2">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from "./../components/UserSettings/EditProfileSideBar";
export default {
  components: {
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

a {
  color: grey;
}

a:hover {
  color: darkgrey;
}

.col {
  padding-right: 0;
}

.col1 {
  padding-right: 0;
}

.col2 {
  padding-left: 0;
}
</style>
