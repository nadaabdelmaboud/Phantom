import axios from "axios";

const state = {
  comments: false,
};

const mutations = {
  commentIsAdded(state, comment) {
    state.comments = comment;
  },
};

const actions = {
  postPageAddedComments({ commit }, postPageId) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .post("pins/" + postPageId + "/comments")
      .then((response) => {
        commit("commentIsAdded", response.data.success);
        console.log("Comments", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
