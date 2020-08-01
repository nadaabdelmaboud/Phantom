<template>
  <div class="home">
    <h1>Hello Phantom 😍😍</h1>
    <div class="container">
        <HomeCard
        class="box"
          v-for="homecard in cards"
          :key="homecard._id"
          :cardImage="homecard.imageId"
        />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/_Colors";
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body{
  display: flex;
  justify-content: center;
  align-self: center;
  min-height: 100vh;

}
.container{
position: relative;
max-width: 100%;
display: grid;
grid-template-columns: repeat(auto-fill, minmax(250px , 1fr));
grid-template-rows:  minmax(100px , auto);
margin: 15px;
grid-auto-flow: dense;
grid-gap: 10px;
}
.container .box {
  padding: 20px;
  display: grid;
  place-items: center;
  text-align: center;
  transition: 0.5s;

}
.container .box:hover {
  background: $lightgrey;
}
@media (max-width: 990px) {
  .container {
  grid-template-columns: repeat(auto-fill, minmax(50% , 1fr));
grid-template-rows:  minmax(auto , auto);
  }
  .container .box {
    grid-column:unset !important ;
    grid-row: unset !important;
  }
}
</style>

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
