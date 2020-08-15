import axios from "axios";

const state = {
  userFollowers: []
};

const mutations = {
  setFollowers(state, followers) {
    state.userFollowers = followers;
  }
};

const actions = {
  getFollowers({ commit }, boardData) {
    axios
      .get("me/follower", boardData)
      .then(response => {
        let followers = response.data.followers;
        commit("setFollowers", followers);
      })
      .catch(error => {
        console.log(error);
      });
  }
};

const getters = {
  userFollowers: state => state.userFollowers
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
