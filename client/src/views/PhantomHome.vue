<template>
  <div class="home">
    <HomeNavigationBar />
    <router-view class="mainComponent"/>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/Colors";
.mainComponent{
  background-color: $offWhite;
  min-height: calc(100vh);
  padding-top: 80px;
}
</style>
<script>
import HomeNavigationBar from "../components/HomeNavigationBar";
export default {
  name: "PhantomHome",
  components: {
    HomeNavigationBar
  }
};
</script>