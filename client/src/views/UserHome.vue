<template>
  <div class="home" :key="userKey">
    <div class="PhantomHome" v-if="isLoggedIn() == false">
      <!-- <Loading :loading="homeLoading && isLoggedIn()" v-if="homeLoading" /> -->
      <div class="PhantomName">
        <h1>
          <span>𝓟</span>
          <span>𝓱</span>
          <span>𝓪</span>
          <span>𝓷</span>
          <span>𝓽</span>
          <span>𝓸</span>
          <span>𝓶</span>
        </h1>
      </div>
    </div>
    <div v-if="isLoggedIn() == true">
      <div class="addTopics">
        <h2>Add more Ideas to your feed</h2>
        <i class="fa fa-plus" @click="showTopics"></i>
      </div>
      <Loading :loading="homeLoading" />
      <!-- ////////////////// -->
      <!-- ///////////transition-group appear name="slide-in" tag="div" -->
      <!-- ////////////////// -->
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
.PhantomHome {
  display: flex;
  justify-content: center;
}
.PhantomName {
  border-radius: 50%;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  width: 40%;
  height: 5em;
  background-color: transparent;
  h1 {
    position: absolute;
    margin: 0;
    padding: 0;
    font-weight: 900;
    font-size: 55px;
    color: $darkBlue;
    span {
      position: relative;
      display: inline-block;
      animation: animate 1.5s linear infinite;
    }
  }
}
h1 span:nth-child(1) {
  animation-delay: 0s;
}
h1 span:nth-child(2) {
  animation-delay: 0.2s;
}
h1 span:nth-child(3) {
  animation-delay: 0.4s;
}
h1 span:nth-child(4) {
  animation-delay: 0.6s;
}
h1 span:nth-child(5) {
  animation-delay: 0.8s;
}
h1 span:nth-child(6) {
  animation-delay: 1s;
}
h1 span:nth-child(7) {
  animation-delay: 1.2s;
}
@keyframes animate {
  0% {
    transform: translateY(0px);
  }
  10% {
    transform: translateY(-30px);
  }
  15% {
    transform: translateY(0px);
  }
  25% {
    transform: translateY(-20px);
  }
  30% {
    transform: translateY(0px);
  }
  40% {
    transform: translateY(-10px);
  }
  45% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(0px);
  }
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
.slide-in-enter {
  opacity: 0;
  transform: scale(0.5);
}
.slide-in-enter-active {
  transition: all 0.4s ease;
  transition-delay: calc(0.01s * var(cardIndex));
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
    return {};
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
  mounted() {
    setTimeout(() => {
      this.$store.dispatch("homeCards/userHome");
      setTimeout(() => {
        this.$store.dispatch("homeCards/userGenerateCards", 10);
      }, 3000);
    }, 1000);
  },
  methods: {
    showTopics() {
      this.$store.commit("popUpsState/toggleTopicsPopup");
    }
  }
};
</script>
