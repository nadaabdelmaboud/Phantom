<template>
  <div class="home">
    <HomeNavigationBar />
    <router-view />
  </div>
</template>

<script>
import HomeNavigationBar from "../components/HomeNavigationBar";
export default {
  name: "PhantomHome",
  components: {
    HomeNavigationBar
  }
};
</script>
