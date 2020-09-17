<template>
  <div class="flexWrap">
    <div class="masonryGrid">
      <HomeCard
        v-for="p in morePins"
        :key="p._id"
        :cardImage="p.imageId"
        :postPageId="p._id"
        class="masonryGridItem"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import HomeCard from "../components/HomeCard";
import imagesLoaded from "imagesloaded"
export default {
  name: "BoardMoreLike",
  data: function() {
    return {
      boardId: "",
    };
  },
  components: {
    HomeCard,
  },
  computed: {
    ...mapGetters({
      morePins: "boards/moreLike",
    }),
  },
  methods: {
    resizeAllMasonryItems() {
      // Get all item class objects in one list
      var allItems = document.getElementsByClassName("masonryGridItem");

      /*
       * Loop through the above list and execute the spanning function to
       * each list-item (i.e. each masonry item)
       */
      for (var i = 0; i < allItems.length; i++) {
        this.resizeMasonryItem(allItems[i]);
      }
    },
    resizeMasonryItem(item) {
      /* Get the grid object, its row-gap, and the size of its implicit rows */
      var grid = document.getElementsByClassName("masonryGrid")[0],
        rowGap = parseInt(
          window.getComputedStyle(grid).getPropertyValue("grid-row-gap")
        ),
        rowHeight = parseInt(
          window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")
        );
      /*

       * Spanning for any brick = S
       * Grid's row-gap = G
       * Size of grid's implicitly create row-track = R
       * Height of item content = H
       * Net height of the item = H1 = H + G
       * Net height of the implicit row-track = T = G + R
       * S = H1 / T
       */
        console.log(rowGap ,rowHeight,item)

      // var rowSpan = Math.ceil(
      //   (item.querySelector(".masonryGridItem").getBoundingClientRect().height +
      //     rowGap) /
      //     (rowHeight + rowGap)
      // );

      /* Set the spanning as calculated above (S) */
     // item.style.gridRowEnd = "span " + rowSpan;
    },
    waitForImages() {
      var allItems = document.getElementsByClassName("masonryGridItem");
      for (var i = 0; i < allItems.length; i++) {
        imagesLoaded(allItems[i], (instance) =>{
          var item = instance.elements[0];
          this.resizeMasonryItem(item);
        });
      }
    },
  },
  created: function() {
    console.log(this.$route);
    this.boardId = this.$route.params.boardId;
    this.$store.dispatch("boards/moreLike", {
      boardId: this.boardId,
      generate: true,
    });
    setTimeout(() => {
      this.waitForImages();
    }, 1000);
  },
};
</script>

<style lang="scss" scoped>
// @import "../scss/MasonryGrid";
.flexWrap {
  margin: auto;
  width: 90%;
}
.masonryGrid {
  display: grid;
  grid-gap: 2em; /* [1] Add some gap between rows and columns */
  grid-template-columns: repeat(
    auto-fill,
    minmax(252px, 1fr)
  ); /* [2] Make columns adjust according to the available viewport */
  grid-auto-rows: 200px; /* [3] Set the height for implicitly-created row track */
}
// .masonryGridItem {
// }
</style>
