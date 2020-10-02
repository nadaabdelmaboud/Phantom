<template>
  <div>
    <div class="secctionInfo">
      <h1>{{ section.section.sectionName }}</h1>
      <p>{{ section.pins.length }} pins</p>
    </div>
    <div class="flexWrap">
      <masonry
        :cols="{ default: 5, 1500: 4, 1200: 3, 800: 2, 580: 1 }"
        :gutter="{ default: '30px', 700: '20px', 500: '10px' }"
      >
        <HomeCard
          v-for="b in section.pins"
          :key="b.pin._id"
          :cardImage="b.pin.imageId"
          :postPageId="b.pin._id"
        />
      </masonry>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HomeCard from "../components/Home/HomeCard";

export default {
  name: "SectionView",
  data: function() {
    return {
      sectonId: "",
      boardId: ""
    };
  },
  components: {
    HomeCard
  },
  computed: {
    ...mapGetters({
      section: "boards/section"
    })
  },
  created() {
    this.boardId = this.$route.params.boardId;
    this.sectionId = this.$route.params.sectionId;
    this.$store.dispatch("boards/getFullSection", {
      boardId: this.boardId,
      sectionId: this.sectionId
    });
  }
};
</script>

<style lang="scss" scoped>
@import "../scss/Colors";
@import "../scss/Mixins";
@import "../scss/MasonryGrid";

.flexWrap {
  margin: auto;
  width: 90%;
}

h1 {
  text-align: center;
  font-weight: 700;
  font-size: 36px;
}
p {
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
}
</style>
