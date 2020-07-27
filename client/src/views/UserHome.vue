<template>
  <div class="home">
    <h1>Hello Phantom 😍😍</h1>
    <HomeCard v-for="homecard in cards"
       :key="homecard._id"
       :cardImage="homecard.imageId" />
  </div>
</template>

<script>
import HomeCard from "../components/HomeCard";
import { mapGetters } from "vuex";
export default {
  name: "UserHome",
  components: {
    HomeCard
  },
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
