import axios from "axios";

const state = {
  All: []
};

const mutations = {
  setAllRecommend(state, cards) {
    state.All = cards;
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
  }
};

const getters = {
  All: state => state.All
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
