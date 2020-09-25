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
            <li
              v-for="list in firstList"
              :key="list.name"
              @click="getTopicName(list.name)"
            >
              {{ list.name }}
            </li>
          </ul>
          <ul class="restTopicsList">
            <li
              v-for="list in secondList"
              :key="list.name"
              @click="getTopicName(list.name)"
            >
              {{ list.name }}
            </li>
          </ul>
        </div>
        <Loading :loading="popupLoading" v-if="popupLoading" />
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
      popupLoading: "follow/popupLoading",
      firstList: "follow/firstList",
      secondList: "follow/secondList"
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
