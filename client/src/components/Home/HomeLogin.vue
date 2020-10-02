<template>
  <div class="homeLogin">
    <div class="addTopics">
      <h2>Add more Ideas to your feed</h2>
      <i class="fa fa-plus" @click="showTopics"></i>
    </div>
    <Loading :loading="homeLoading" />
    <div class="flexWrap" v-if="!homeLoading">
      <masonry
        :cols="{ default: 5, 1500: 4, 1200: 3, 800: 2, 580: 1 }"
        :gutter="{ default: '30px', 700: '20px', 500: '10px' }"
      >
        <HomeCard
          v-for="homecard in cards"
          :key="homecard._id"
          :cardImage="homecard.imageId"
          :postPageId="homecard._id"
        />
      </masonry>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../scss/_Colors";
@import "../../scss/MasonryGrid";
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
import HomeCard from "./HomeCard";
import Loading from "../../components/GeneralComponents/Loading";
import { mapGetters } from "vuex";
export default {
  name: "HomeLogin",
  components: {
    HomeCard,
    Loading
  },
  computed: {
    ...mapGetters({
      cards: "homeCards/userHomePage",
      homeLoading: "homeCards/homeLoading"
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
