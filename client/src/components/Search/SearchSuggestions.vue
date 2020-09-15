<template>
  <div id="search" @click="closeWindow">
    <div class="popup-content">
      <p v-for="suggestion in suggestions" :key="suggestion.title">
        {{ suggestion.title }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    suggestions() {
      return this.$store.state.search.suggestions;
    }
    // pepoleSuggestions() {
    //   return this.$store.state.search.people;
    // }
  },
  methods: {
    closeWindow() {
      if (event.target.id == "search")
        this.$store.commit("popUpsState/toggleSearchSuggestions");
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
