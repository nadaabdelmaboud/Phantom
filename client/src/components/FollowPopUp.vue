<template>
  <div class="followPopup">
    <div class="content">
      <h5 class="title">Build your Following Feed</h5>
      <div class="navBar">
        <ul>
          <li @click="getAllRecommend">All</li>
          <li @click="getTrendingRecommend">Trending</li>
          <li @click="getTopicName('Art')">Art</li>
          <li @click="getTopicName('Diy')">Diy</li>
          <li @click="openList">More</li>
        </ul>
      </div>
      <div class="cardsDiv">
        <div class="restTopicsListDiv" v-if="showTopicslist">
          <ul class="restTopicsList">
            <li @click="getTopicName('Travel')">Travel</li>
            <li @click="getTopicName('Anime')">Anime</li>
            <li @click="getTopicName('Babies')">Babies</li>
            <li @click="getTopicName('Photography')">Photography</li>
            <li @click="getTopicName('Kpop')">Kpop</li>
            <li @click="getTopicName('The Witcher')">The Witcher</li>
            <li @click="getTopicName('Design')">Design</li>
            <li @click="getTopicName('Books')">Books</li>
            <li @click="getTopicName('Flowers')">Flowers</li>
            <li @click="getTopicName('Men Style')">Men Style</li>
            <li @click="getTopicName('Nutrition')">Nutrition</li>
            <li @click="getTopicName('Desserts')">Desserts</li>
            <li @click="getTopicName('Nature')">Nature</li>
            <li @click="getTopicName('Memes')">Memes</li>
            <li @click="getTopicName('Quran')">Quran</li>
            <li @click="getTopicName('Sewing')">Sewing</li>
            <li @click="getTopicName('Skin Care')">Skin Care</li>
            <li @click="getTopicName('Education')">Education</li>
            <li @click="getTopicName('Peircing')">Peircing</li>
            <li @click="getTopicName('Prom Dresses')">Prom Dresses</li>
            <li @click="getTopicName('Love Quotes')">Love Quotes</li>
            <li @click="getTopicName('Dresses Gowns')">Dresses Gowns</li>
          </ul>
          <ul class="restTopicsList">
            <li @click="getTopicName('Anime Girls')">Anime Girls</li>
            <li @click="getTopicName('Animation')">Animation</li>
            <li @click="getTopicName('Braids')">Braids</li>
            <li @click="getTopicName('Baking')">Baking</li>
            <li @click="getTopicName('Recipes')">Recipes</li>
            <li @click="getTopicName('Makeup')">Makeup</li>
            <li @click="getTopicName('Beauty')">Beauty</li>
            <li @click="getTopicName('Hairstyles')">Hairstyles</li>
            <li @click="getTopicName('Cooking')">Cooking</li>
            <li @click="getTopicName('Astronomy')">Astronomy</li>
            <li @click="getTopicName('Disney')">Disney</li>
            <li @click="getTopicName('Writing')">Writing</li>
            <li @click="getTopicName('Animals')">Animals</li>
            <li @click="getTopicName('Cats')">Cats</li>
            <li @click="getTopicName('Nails')">Nails</li>
            <li @click="getTopicName('Shoes')">Shoes</li>
            <li @click="getTopicName('Road Trips')">Road Trips</li>
            <li @click="getTopicName('Gardening')">Gardening</li>
            <li @click="getTopicName('Tatto')">Tatto</li>
            <li @click="getTopicName('Men Fitness')">Men Fitness</li>
            <li @click="getTopicName('Harry Potter')">Harry Potter</li>
            <li @click="getTopicName('Eyemakeup')">Eyemakeup</li>
          </ul>
        </div>
        <Loading :loading="popupLoading" />
        <div class="AllCards" v-if="showAll && !popupLoading">
          <div v-for="card in All" :key="card.user._id">
            <FollowCard
              :userId="card.user._id"
              :followers="card.user.followers"
              :firstName="card.user.firstName"
              :lastName="card.user.lastName"
              :cardImage="card.user.profileImage"
              :type="card.recommendType"
              typeOfCard="All"
            />
          </div>
        </div>
        <div class="Trending" v-if="showTrending && !popupLoading">
          <div v-for="card in Trending" :key="card.user._id">
            <FollowCard
              :userId="card.user._id"
              :followers="card.user.followers"
              :firstName="card.user.firstName"
              :lastName="card.user.lastName"
              :cardImage="card.user.profileImage"
              :type="card.recommendType"
              typeOfCard="Trending"
            />
          </div>
        </div>
        <div class="Topics" v-if="showTopics && !popupLoading">
          <div v-for="card in Topics" :key="card._id">
            <FollowCard
              :userId="card._id"
              :followers="card.followers"
              :firstName="card.firstName"
              :lastName="card.lastName"
              :cardImage="card.profileImage"
              :type="nameOfTopic"
              typeOfCard="Topics"
            />
          </div>
        </div>
      </div>
      <div class="optionsDiv">
        <button class="optionBtns" id="doneButton" @click="closePopUp">
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/Colors";
@import "../scss/Mixins";
.followPopup {
  @include popUpBackground;
}
.content {
  @include popUpContent;
  margin-top: 30px;
  padding-left: 1px;
  padding-right: 1px;
  width: 60%;
}
.title {
  @include popUpTitle;
  margin-bottom: 10px;
}
ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  justify-content: center;
  li {
    padding: 10px;
    font-size: 15px;
    font-weight: 700;
    border-radius: 18px;
    color: rgb(100, 98, 98);
    cursor: pointer;
    &:hover {
      background-color: rgba(192, 189, 189, 0.5);
    }
  }
}
.restTopicsListDiv {
  position: absolute;
  z-index: 20;
  margin-top: 10px;
  margin-bottom: 10px;
  left: 60%;
  width: 30%;
  display: flex;
  border-radius: 12px;
  box-shadow: 0 5px 10px 10px rgba(0, 0, 0, 0.06);
  justify-content: center;
  overflow-y: auto;
  height: 450px;
  background-color: white;
}
.restTopicsList {
  display: block;
  text-align: center;
  li {
    padding: 12px;
  }
}
.cardsDiv {
  position: relative;
  height: 400px;
  overflow-y: auto;
}
.optionsDiv {
  display: flex;
  justify-content: flex-end;
  margin-right: 27px;
}
.optionBtns {
  margin-top: 20px;
  margin-left: 8px;
  letter-spacing: 1px;
  background-color: $lightBlue;
  color: white;
  font-weight: 700;
  border-radius: 500px;
  border-color: transparent;
  align-content: center;
  padding: 5px;
  width: 70px;
  &:hover {
    background-color: $darkBlue;
    opacity: 1;
  }
}
button:focus {
  outline: 0 !important;
}
.AllCards,
.Trending,
.Topics {
  margin-top: 15px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(275px, 1fr));
  gap: 7px;
  justify-items: center;
}
@media screen and (max-width: 1400px) {
  .content {
    width: 70%;
  }
}
@media screen and (max-width: 1150px) {
  .content {
    width: 75%;
  }
}
@media screen and (max-width: 1070px) {
  .content {
    width: 80%;
  }
}
@media screen and (max-width: 990px) {
  .content {
    width: 85%;
  }
  .restTopicsListDiv {
    width: 35%;
  }
}
@media screen and (max-width: 800px) {
  .restTopicsListDiv {
    width: 40%;
    left: 50%;
  }
}
@media screen and (max-width: 700px) {
  .restTopicsListDiv {
    width: 45%;
    left: 45%;
  }
}
@media screen and (max-width: 630px) {
  .content {
    width: 95%;
  }
  .restTopicsListDiv {
    width: 47%;
    left: 40%;
  }
}
@media screen and (max-width: 575px) {
  .AllCards,
  .Trending,
  .Topics {
    justify-items: center;
  }
}
@media screen and (max-width: 530px) {
  .restTopicsListDiv {
    width: 52%;
    left: 40%;
  }
}
@media screen and (max-width: 411px) {
  .restTopicsListDiv {
    width: 65%;
    left: 20%;
  }
  .cardsDiv {
    height: 300px;
  }
}
@media screen and (max-width: 300px) {
  li {
    padding: 4px;
  }
  .content {
    margin-top: 8px;
  }
  .restTopicsListDiv {
    width: 75%;
    left: 20%;
  }
  .AllCards,
  .Trending,
  .Topics {
    grid-template-columns: repeat(auto-fill, minmax(263px, 1fr));
  }
}
</style>

<script>
import Loading from "../components/GeneralComponents/Loading";
import FollowCard from "../components/FollowCard";
import { mapGetters } from "vuex";
export default {
  name: "followPopUp",
  data: function() {
    return {
      showTopicslist: false,
      showAll: true,
      showTrending: false,
      showTopics: false,
      nameOfTopic: ""
    };
  },
  components: {
    FollowCard,
    Loading
  },
  computed: {
    ...mapGetters({
      All: "follow/All",
      Trending: "follow/Trending",
      Topics: "follow/Topics",
      popupLoading: "follow/popupLoading"
    })
  },
  methods: {
    closePopUp() {
      this.$store.commit("popUpsState/toggleshowFollowPopup");
    },
    getAllRecommend() {
      this.$store.dispatch("follow/allRecommendations");
      this.showAll = true;
      this.showTrending = false;
      this.showTopics = false;
    },
    getTrendingRecommend() {
      this.$store.dispatch("follow/trendingRecommendations");
      this.showAll = false;
      this.showTrending = true;
      this.showTopics = false;
    },
    async getTopicName(topicName) {
      if (this.showTopicslist == true) this.openList();
      await this.$store.dispatch("follow/topicsRecommendations", topicName);
      this.showAll = false;
      this.showTrending = false;
      this.showTopics = true;
      this.nameOfTopic = topicName;
    },
    openList() {
      this.showTopicslist = !this.showTopicslist;
    }
  }
};
</script>
