<template>
  <div class="followPopup">
    <div class="content">
      <h5 class="title">Build your Following Feed</h5>
      <div class="navBar">
        <ul>
          <li @click="getAllRecommend">All</li>
          <li @click="getTrendingRecommend">Trending</li>
          <li @click="getTopicName('Art')">Art</li>
          <li @click="getTopicName('Nature')">Diy</li>
          <li @click="openList">More</li>
        </ul>
      </div>
      <div class="cardsDiv">
        <div class="restTopicsListDiv" v-if="showTopicslist">
          <ul class="restTopicsList">
            <li>Travel</li>
            <li>Anime</li>
            <li>Babies</li>
            <li>Photography</li>
            <li>Kpop</li>
            <li>The Witcher</li>
            <li>Design</li>
            <li>Books</li>
            <li>Flowers</li>
            <li>Men Style</li>
            <li>Nutrition</li>
            <li @click="getTopicName('Desserts')">Desserts</li>
            <li>Nature</li>
            <li>Memes</li>
            <li>Quran</li>
            <li>Sewing</li>
            <li>Skin Care</li>
            <li>Education</li>
            <li>Peircing</li>
            <li>Prom Dresses</li>
            <li>Love Quotes</li>
            <li>Dresses Gowns</li>
          </ul>
          <ul class="restTopicsList">
            <li>Anime Girls</li>
            <li>Animation</li>
            <li>Braids</li>
            <li>Baking</li>
            <li @click="getTopicName('Recipes')">Recipes</li>
            <li>Makeup</li>
            <li>Beauty</li>
            <li>Hairstyles</li>
            <li>Cooking</li>
            <li>Astronomy</li>
            <li>Disney</li>
            <li>Writing</li>
            <li>Animals</li>
            <li>Cats</li>
            <li>Nails</li>
            <li>Shoes</li>
            <li>Road Trips</li>
            <li>Gardening</li>
            <li>Tatto</li>
            <li>Men Fitness</li>
            <li>Harry Potter</li>
            <li>Eyemakeup</li>
          </ul>
        </div>
        Nihal mansour
      </div>
      <!-- <FollowCard /> -->
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
}
</style>

<script>
// import FollowCard from "../components/FollowCard";
export default {
  name: "followPopUp",
  data: function() {
    return {
      showTopicslist: false
    };
  },
  //     components: {
  //     FollowCard
  //   }
  methods: {
    closePopUp() {
      this.$store.commit("popUpsState/toggleshowFollowPopup");
    },
    getAllRecommend() {},
    getTrendingRecommend() {},
    getTopicName(topicName) {
      console.log("TopicName Nihal", topicName);
    },
    openList() {
      this.showTopicslist = !this.showTopicslist;
    }
  }
};
</script>
