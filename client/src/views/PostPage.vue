<template>
  <div class="postpage">
    <div class="row m-0">
      <post-page-card />
    </div>
    <div class="row m-0">
      <span>More like this</span>
    </div>
    <Loading :loading="moreLoading" />
    <div class="flexWrap" v-if="!moreLoading">
      <div class="masonryGrid">
        <HomeCard
          v-for="morepin in morePins"
          :key="morepin._id"
          class="masonryGridItem"
          :cardImage="morepin.imageId"
          :postPageId="morepin._id"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/MasonryGrid";
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
import HomeCard from "../components/Home/HomeCard";
import Loading from "../components/GeneralComponents/Loading";
export default {
  name: "postpage",
  components: {
    PostPageCard,
    HomeCard,
    Loading
  },
  async mounted() {
    await this.$store.dispatch(
      "homeCards/Postpage",
      this.$route.params.postPageId
    );
    await this.$store.dispatch("phantomUser/isFollowed", this.pinCreatorId);
  },
  created() {
    this.$store.dispatch(
      "postPage/moreLikeThisPin",
      this.$route.params.postPageId
    );
    setTimeout(() => {
      this.$store.dispatch("postPage/generateMorePins", {
        pinId: this.$route.params.postPageId,
        limit: 10
      });
    }, 3000);
  },
  computed: {
    ...mapGetters({
      pinCreatorId: "homeCards/pinCreatorId",
      morePins: "postPage/morePins",
      moreLoading: "postPage/moreLoading"
    })
  }
};
</script>
