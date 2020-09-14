<template>
  <div id="search" @click="closeWindow">
    <div class="popup-content">
      <div class="recent-search" v-if="recentSearch">
        <p>Recent Searchs</p>
        <p v-for="search in recentSearch" :key="search">{{ search }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.dispatch("search/getRecentSearch");
  },
  computed: {
    recentSeacrh() {
      return this.$store.state.search.recentSeacrh;
    }
  },
  methods: {
    closeWindow() {
      if (event.target.id == "search")
        this.$store.commit("popUpsState/toggleSearchWindow");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/Mixins";
#search {
  @include popUpBackground;
  margin-top: 11vh;
}

.title {
  @include popUpTitle;
}

/**PopUp
*******************/
.popup-content {
  @include popUpContent;
  width: calc(100vw - 430px);
  margin-left: 15vw;
  height: 40vh;
  border-radius: 0;
  min-width: 400px;
}
</style>
