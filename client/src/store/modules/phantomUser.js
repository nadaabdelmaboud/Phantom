import axios from "axios";

const state = {
  user: [],
  isFollowed: "",
};

const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setIsFollowed(state, isFollowed) {
    state.isFollowed = isFollowed;
  },
};

const actions = {
  getUser({ commit }, userId) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .get("user/" + userId)
      .then((response) => {
        commit("setUser", response.data.user);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  isFollowed({ commit }, userId) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .get("me/follow-user/" + userId)
      .then((response) => {
        commit("setIsFollowed", response.data.follow);
      })
      .catch((error) => {
        console.log(error);
      });
  },
};

const getters = {
  user: (state) => state.user,
  isFollowed: (state) => state.isFollowed,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
