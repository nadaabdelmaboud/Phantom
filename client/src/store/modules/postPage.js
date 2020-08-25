import axios from "axios";

const state = {
  comments: false,
  followUser: false,
};

const mutations = {
  commentIsAdded(state, comment) {
    state.comments = comment;
  },
  followUser(state, followUser) {
    state.followUser = followUser;
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
  followPinCreator({ commit }, pinCreatorId) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .put("me/follow-user/" + pinCreatorId)
      .then(() => {
        commit("followUser", true);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  unFollowPinCreator({ commit }, pinCreatorId) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .delete("me/follow-user/" + pinCreatorId)
      .then(() => {
        commit("followUser", false);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const getters = {
  followUser: (state) => state.followUser,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
