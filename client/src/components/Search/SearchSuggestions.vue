<template>
  <div id="search" @click="closeWindow">
    <div class="popup-content">
      <div class="titles">
        <p
          v-for="suggestion in suggestions"
          :key="suggestion.name"
          @click="searchFor(suggestion.name)"
        >
          {{ suggestion.name }}
        </p>
      </div>
      <div class="user">
        <div
          v-for="suggestion in pepoleSuggestions"
          :key="suggestion._id"
          class="row"
          @click="openUserProfile(suggestion._id)"
        >
          <img
            :src="
              getImage(
                suggestion.profileImage,
                suggestion.google,
                suggestion.googleImage
              )
            "
            alt="profile image"
          />

          <p class="usernames">{{ suggestion.userName }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getImage from "../../mixins/getImage";

export default {
  computed: {
    suggestions() {
      return this.$store.state.search.keys;
    },
    pepoleSuggestions() {
      return this.$store.state.search.searchSuggestions;
    }
  },
  methods: {
    closeWindow() {
      if (event.target.id == "search")
        this.$store.commit("popUpsState/toggleSearchSuggestions");
    },
    openUserProfile(userID) {
      this.$router.push(`/User/${userID}`);
      this.$store.commit("popUpsState/toggleSearchSuggestions");
    },
    searchFor(title) {
      this.$store.commit("popUpsState/toggleSearchSuggestions");
      this.$router.replace("/search/allpins/" + title);
    }
  },
  mixins: [getImage]
};
</script>

<style lang="scss" scoped>
@import "../../scss/Colors";
@import "../../scss/Mixins";
#search {
  @include popUpBackground;
  margin-top: 80px;
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
  height: 55vh;
  border-radius: 0;
  min-width: 360px;
}

.titles :hover {
  cursor: pointer;
  background-color: $qainsboro;
}

/*Pepole Suggestions
*********************/
.user :hover {
  background-color: $qainsboro;
  cursor: pointer;
}

.username {
  display: inline;
  margin: 4px 0 0 4px;
  padding-top: 2px;
}

img {
  border-radius: 30px;
  width: 30px;
  height: 30px;
  margin: 0px 4px 5px 4px;
  padding-top: 2px;
}
</style>
