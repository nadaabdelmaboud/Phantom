<template>
  <div class="followingPage">
    <div class="title">
      <h4>From People you follow</h4>
      <button class="followPopup" @click="showRecommendationPopUp">
        Find people to follow
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/_Colors";
@import "../scss/Mixins";
.followingPage {
  justify-content: center;
}
.title {
  display: flex;
  margin: auto;
  padding: 35px;
  justify-content: center;
}
h4 {
  margin-right: 10%;
  color: black;
  font-weight: 700;
  font-size: 25px;
}
.followPopup {
  letter-spacing: 1px;
  background-color: $lightBlue;
  color: white;
  border-radius: 500px;
  border-color: transparent;
  align-content: center;
  padding: 5px;
  width: 220px;
  height: 40px;
  font-weight: 500;
  margin-top: 25px;
  &:hover {
    background-color: $darkBlue;
  }
}
button:focus {
  outline: 0 !important;
}
@media screen and (max-width: 630px) {
  .title {
    flex-flow: wrap;
  }
  h4 {
    margin: 0;
  }
}
</style>

<script>
export default {
  name: "Following",
  created() {
    this.$store.dispatch("follow/allRecommendations");
  },
  methods: {
    showRecommendationPopUp() {
      this.$store.commit("popUpsState/toggleshowFollowPopup");
    }
  }
};
</script>
