<template>
  <div>
    <UserCard
      v-for="user in users"
      :key="user._id"
      :name="user.userName"
      :userID="user._id"
      :imageId="user.profileImage"
      :followersNum="user.followers"
      :boardsNum="user.boards"
    />
  </div>
</template>

<script>
import UserCard from "../Search/UserCard.vue";
export default {
  components: {
    UserCard
  },
  computed: {
    users() {
      return this.$store.state.search.people;
    }
  },
  mounted: function() {
    this.$store.dispatch("search/searchPeople", {
      name: this.$route.params.name
    });
  }
};
</script>

<style lang="scss" scoped></style>
