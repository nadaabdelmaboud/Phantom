<template>
  <div class="home">
    <div v-if="isLoggedIn() == false">
      <p>Home Page ,Signup or Login</p>
    </div>
    <div v-if="isLoggedIn() == true">
      <div class="masonry">
        <HomeCard
          class="masonryItem"
          v-for="homecard in cards"
          :key="homecard._id"
          :cardImage="homecard.imageId"
          :postPageId="homecard._id"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/_Colors";
@import "../scss/MasonryGrid";
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
import HomeCard from "../components/HomeCard";
import { mapGetters } from "vuex";
import { default as isLoggedIn } from "../mixins/isLoggedIn";
export default {
  name: "UserHome",
  components: {
    HomeCard
  },
  mixins: [isLoggedIn],
  mounted() {
    this.$store.dispatch("homeCards/userHome");
  },
  computed: {
    ...mapGetters({
      cards: "homeCards/userHomePage"
    })
  }
};
</script>
