<template>
  <div class="home" :key="userKey">
    <div v-if="isLoggedIn() == false">
      <Loading :loading="homeLoading  && isLoggedIn()" />
      <p>Home Page ,Signup or Login</p>
    </div>
    <div v-if="isLoggedIn() == true">
      <div class="addTopics">
        <h2>Add more Ideas to your feed</h2>
        <i class="fa fa-plus" @click="showTopics"></i>
      </div>
      <Loading :loading="homeLoading" />
      <div class="flexWrap" v-if="!homeLoading">
        <div class="masonryGrid">
          <HomeCard
            v-for="homecard in cards"
            :key="homecard._id"
            class="masonryGridItem"
            :cardImage="homecard.imageId"
            :postPageId="homecard._id"
          />
        </div>
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
.addTopics {
  width: 97%;
  margin: 5px auto;
  background-color: white;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  justify-content: space-between;
  h2 {
    text-align: center;
    font-size: 22px;
    font-weight: 700;
    padding-top: 10px;
  }
  i {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    background-color: $offWhite;
    padding: 17px;
    transition: linear 0.2s;
  }
  i:hover {
    background-color: $ligthPaige;
  }
}
</style>

<script>
import HomeCard from "../components/HomeCard";
import Loading from "../components/GeneralComponents/Loading";
import { mapGetters, mapState } from "vuex";
import { default as isLoggedIn } from "../mixins/isLoggedIn";
export default {
  name: "UserHome",
  data: function() {
    return {
      //userKey:false
    };
  },
  components: {
    HomeCard,
    Loading
  },
  mixins: [isLoggedIn],
  computed: {
    ...mapGetters({
      cards: "homeCards/userHomePage",
      homeLoading: "homeCards/homeLoading"
    }),
    ...mapState({
      userKey: state => state.user.userKey
    })
  },
  created() {
    if (localStorage.getItem("userToken") != "") {
      this.$store.dispatch("homeCards/userHome");
      setTimeout(() => {
        this.$store.dispatch("homeCards/userGenerateCards", 10);
      }, 3000);
    }
  },
  methods: {
    showTopics() {
      console.log("PPPPPPP");
      this.$store.commit("popUpsState/toggleTopicsPopup");
    }
  }
};
</script>
