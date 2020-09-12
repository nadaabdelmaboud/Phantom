<template>
  <div class="home">
    <ReportPin v-if="showReportPin" />
    <SavePin v-if="showSavePin" />
    <div v-if="isLoggedIn() == false">
      <p>Home Page ,Signup or Login</p>
    </div>
    <div v-if="isLoggedIn() == true">
      <div class="addTopics">
        <h2>Add more Ideas to your feed</h2>
        <i class="fa fa-plus" @click="showTopics"></i>
      </div>
      <div class="masonry">
        <div v-for="homecard in cards" :key="homecard._id" class="masonryItem">
          <HomeCard :cardImage="homecard.imageId" :postPageId="homecard._id" />
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
import ReportPin from "../components/ReportPin";
import SavePin from "../components/SavePin";
import { mapGetters, mapState } from "vuex";
import { default as isLoggedIn } from "../mixins/isLoggedIn";
// import Masonry from "masonry-layout";
//       var grid = document.querySelector('.masonry');
//       var msnry = new Masonry( grid, {
//         // options...
//           horizontalOrder: true,
//           gutter:10,
//           itemSelector: '.masonryItem',
//            columnWidth: 200
//       });
//       msnry.on('layoutComplete' , ()=> console.log("layout completed"))
let screenHeight;
export default {
  name: "UserHome",
  components: {
    HomeCard,
    ReportPin,
    SavePin
  },
  mixins: [isLoggedIn],
  mounted() {
    this.$store.dispatch("homeCards/userHome");
    this.$store.dispatch("homeCards/userGenerateCards");
    screenHeight = 100;
    // if(this.finishCalling === true){
    // console.log("Stop Event Listener");
    // window.removeEventListener("scroll", this.generateHomeCards);
    // }
  },
  // created() {
  //   // window.addEventListener("scroll", this.generateHomeCards);
  // },
  // destroyed() {
  //   window.removeEventListener("scroll", this.generateHomeCards);
  // },
  computed: {
    ...mapGetters({
      cards: "homeCards/userHomePage",
      finishCalling: "homeCards/finishCalling"
    }),
    ...mapState({
      requestFinished: state => state.homeCards.requestFinished,
      showReportPin: state => state.popUpsState.reportPinPopUp,
      showSavePin: state => state.popUpsState.savePinPopUp
    })
  },
  methods: {
    showTopics() {
      console.log("PPPPPPP");
      this.$store.commit("popUpsState/toggleTopicsPopup");
    },
    async generateHomeCards() {
      // if(document.body.scrollTop > 200 || document.documentElement.scrollTop > 200)
      console.log("finish", this.finishCalling);
      console.log("scrollY", window.scrollY);
      console.log("screenHeight", screenHeight);
      if (window.scrollY >= screenHeight) {
        screenHeight += 200;
        await this.$store.dispatch("homeCards/userGenerateCards");
      }
    }
  },
  watch: {
    requestFinished: {
      handler: function(newValue) {
        console.log("requestFinished", newValue);
        if (newValue === true) {
          console.log("start scroll event");
          window.addEventListener("scroll", this.generateHomeCards);
        } else {
          console.log("end scroll event");
          window.removeEventListener("scroll", this.generateHomeCards);
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
