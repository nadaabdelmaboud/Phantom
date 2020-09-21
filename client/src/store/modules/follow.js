import axios from "axios";

const state = {
  All: [],
  Trending: [],
  Topics: []
};

const mutations = {
  setAllRecommend(state, cards) {
    state.All = cards;
  },
  setTrendingRecommend(state, cards) {
    state.Trending = cards;
  },
  setTopicsRecommend(state, cards) {
    state.Topics = cards;
  }
};

const actions = {
  allRecommendations({ commit }) {
    axios
      .get("me/recommendation/follow")
      .then(response => {
        commit("setAllRecommend", response.data);
      })
      .catch(error => {
        console.log(error);
      });
  },
  trendingRecommendations({ commit }) {
    axios
      .get("me/recommendation/trending")
      .then(response => {
        commit("setTrendingRecommend", response.data);
      })
      .catch(error => {
        console.log(error);
      });
  },
  async topicsRecommendations({ commit }, topicName) {
    await axios
      .get("me/recommendation/topics/" + topicName)
      .then(response => {
        commit("setTopicsRecommend", response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }
};

const getters = {
  All: state => state.All,
  Trending: state => state.Trending,
  Topics: state => state.Topics
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
