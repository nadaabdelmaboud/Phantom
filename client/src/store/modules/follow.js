import axios from "axios";

const state = {
  All: [],
  Trending: []
};

const mutations = {
  setAllRecommend(state, cards) {
    state.All = cards;
  },
  setTrendingRecommend(state, cards) {
    state.Trending = cards;
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
  }
};

const getters = {
  All: state => state.All,
  Trending: state => state.Trending
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
