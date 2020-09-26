<template>
  <div>
    <div v-if="users.length">
      <UserCard
        v-for="user in users"
        :key="user._id"
        :name="user.userName"
        :userID="user._id"
        :imagId="user.profileImage || user.googleImage"
        :followersNum="user.followers"
        :boardsNum="user.boards"
        :google="user.google"
      />
    </div>
    <div v-if="!loading && !users.length" class="not-found">
      <h5>
        Sorry, we couldn't find anyone called
        <strong>{{ this.$route.params.name }}</strong>
      </h5>
    </div>
    <div>
      <Loading :loading="loading" />
    </div>
  </div>
</template>

<script>
import UserCard from "../Search/UserCard.vue";
import Loading from "../GeneralComponents/Loading";

export default {
  components: {
    UserCard,
    Loading
  },
  computed: {
    users() {
      return this.$store.state.search.people;
    },
    loading() {
      return this.$store.state.search.peopleLoading;
    }
  },
  mounted: function() {
    this.$store.commit("search/resetOffset");
    this.$store.dispatch("search/searchPeople", {
      name: this.$route.params.name
    });
  }
};
</script>

<style lang="scss" scoped>
.not-found {
  margin-top: 35vh;
  text-align: center;
}
</style>
