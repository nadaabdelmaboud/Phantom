<template>
  <div class="home" :key="userKey">
    <div v-if="isLoggedIn() == false">
      <HomeLogout />
    </div>
    <div v-if="isLoggedIn() == true">
      <HomeLogin />
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  display: flex;
  justify-content: center;
  align-self: center;
  min-height: 100vh;
}
</style>

<script>
import HomeLogin from "../components/Home/HomeLogin";
import HomeLogout from "../components/Home/HomeLogout";
import { mapState } from "vuex";
import { default as isLoggedIn } from "../mixins/isLoggedIn";
export default {
  name: "UserHome",
  components: {
    HomeLogin,
    HomeLogout
  },
  mixins: [isLoggedIn],
  computed: {
    ...mapState({
      userKey: state => state.user.userKey
    })
  }
};
</script>
