<template>
  <div class="home">
    <div v-if="isLoggedIn() == false">
      <p>Home Page ,Signup or Login</p>
    </div>
    <div v-if="isLoggedIn() == true">
      <div class="addTopics">
        <h2>Add more Ideas to your feed</h2>
        <i class="fa fa-plus" @click="showTopics"></i>
      </div>
      <div class="container">
        <HomeCard
          class="box"
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
.container {
  position: relative;
  max-width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-template-rows: minmax(auto, auto);
  margin: auto;
  grid-auto-flow: dense;
  grid-gap: 10px;
}
.container .box {
  width: 100%;
  display: grid;
  place-items: center;
  text-align: center;
  transition: 0.5s;
}
.container .box:hover {
  background: $lightgrey;
}
img {
  width: 100% !important;
  height: auto !important;
}

@media (max-width: 990px) {
  .container {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-template-rows: minmax(auto, auto);
  }
  .container .box {
    grid-column: unset !important ;
    grid-row: unset !important;
  }
}
.addTopics{
  width: 97%;
  margin: 5px auto;
  background-color: white;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  justify-content: space-between;
  h2{
    text-align: center;
    font-size: 22px;
    font-weight: 700;
    padding-top: 10px;
  }
  i{
    width: 48px;
    height: 48px;
    border-radius: 16px;
    background-color: $offWhite;
    padding: 17px;
    transition: linear 0.2s;
  }
  i:hover{
    background-color: $ligthPaige;
  }
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
  },
  methods:{
    showTopics(){
      console.log("PPPPPPP")
       this.$store.commit("popUpsState/toggleTopicsPopup");
    }
  }
};
</script>
