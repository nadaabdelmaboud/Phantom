<template>
  <div class="postpage">
    <div class="row m-0">
      <post-page-card />
    </div>
    <div class="row m-0">
      <span>More like this</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.row {
  display: flex;
  justify-content: center;
  align-items: center;
}
span {
  font-size: 21px;
  font-weight: 700;
  color: black;
  margin: 30px;
}
</style>

<script>
import { mapGetters } from "vuex";
import PostPageCard from "../components/PostPageCard";
export default {
  name: "postpage",
  components: {
    PostPageCard
  },
  async mounted() {
    await this.$store.dispatch(
      "homeCards/Postpage",
      this.$route.params.postPageId
    );
    await this.$store.dispatch("phantomUser/isFollowed", this.pinCreatorId);
  },
  computed: {
    ...mapGetters({
      pinCreatorId: "homeCards/pinCreatorId"
    })
  }
};
</script>
