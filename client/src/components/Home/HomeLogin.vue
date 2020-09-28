<template>
  <div class="homeLogin">
    <div class="addTopics">
      <h2>Add more Ideas to your feed</h2>
      <i class="fa fa-plus" @click="showTopics"></i>
    </div>
    <Loading :loading="homeLoading" />

     <div class="flexWrap" v-if="!homeLoading">
     <!-- <div class="masonryGrid">
        <HomeCard
          v-for="homecard in cards"
          :key="homecard._id"
          class="masonryGridItem"
          :cardImage="homecard.imageId"
          :postPageId="homecard._id"
        />
      </div>-->
    <vue-masonry-wall :items="items" :options="options">
      <template v-slot:default="{item}">
        <HomeCard
          :cardImage="item.imageId"
          :postPageId="item._id"
        />
      </template>
    </vue-masonry-wall>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../scss/_Colors";
@import "../../scss/MasonryGrid";
.addTopics {
  width: 97%;
  margin: 5px auto;
  background-color: white;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  justify-content: space-between;
  h2 {
    text-align: center;
    font-size: 22px;
    font-weight: 700;
    padding-top: 10px;
  }
  i {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    background-color: $offWhite;
    padding: 17px;
    transition: linear 0.2s;
  }
  i:hover {
    background-color: $ligthPaige;
  }

    .Item {
    overflow: hidden;
    border-radius: 4px;
    width: 100%;
    background: #F5F5F5;
  }

}
</style>

<script>
import HomeCard from "./HomeCard";
import Loading from "../../components/GeneralComponents/Loading";
import { mapGetters } from "vuex";
import VueMasonryWall from "vue-masonry-wall";
export default {
  name: "HomeLogin",
  components: {
    HomeCard,
    Loading,
    VueMasonryWall
  },
  data: function() {
    return {
      i:0,
      options:{
          width: 300,
          padding: {
              default: 12,
              1: 6,
              2: 8,
          },
          throttle: 300
      },
      ssr: {
        column: 12
      },
      width: window.outerWidth
    }
  },
  computed: {
    ...mapGetters({
      items: "homeCards/userHomePage",
      homeLoading: "homeCards/homeLoading"
    })
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    })
    setTimeout(() => {
      this.$store.dispatch("homeCards/userHome");
      setTimeout(() => {
        this.$store.dispatch("homeCards/userGenerateCards", 10);
      }, 3000);
    }, 1000);
  },
    beforeDestroy() { 
    window.removeEventListener('resize', this.onResize); 
  },
  methods: {
    showTopics() {
      this.$store.commit("popUpsState/toggleTopicsPopup");
    },
    // append() {
    //     for (this.i; this.i < this.cards.length; this.i++) {
    //       this.items.push({
    //         imageId: this.cards[this.i].imageId,
    //         _id: this.cards[this.i]._id
    //       })
    //     }
    //   },
          onResize() {
      this.width = window.outerWidth
    }
  },
  watch:{
    // width: function() {
    //   console.log("weeeee");
    //   this.i=0;
    //   this.items=[]
    //   this.append();
    // }
  }
};
</script>
