import axios from "axios";

const state = {
  comments: false,
  followUser: false,
  react: false,
  pinComments: [],
  likeComment: false
};

const mutations = {
  commentIsAdded(state, comment) {
    state.comments = comment;
  },
  followUser(state, followUser) {
    state.followUser = followUser;
  },
  setpinReacts(state, react) {
    state.react = react;
  },
  setPinComments(state, comment) {
    console.log("Array in mutation", comment);
    state.pinComments = comment;
  },
  addNewComment(state, comment) {
    state.pinComments.push(comment);
  },
  likeComment(state, like) {
    state.likeComment = like;
  }
};

const actions = {
  postPageAddedComments({ commit }, { postPageId, comment }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .post("pins/" + postPageId + "/comments", comment)
      .then(response => {
        commit("commentIsAdded", response.data.success);
        console.log("Comments", response.data);
      })
      .catch(error => {
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
      .catch(error => {
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
      .catch(error => {
        console.log(error);
      });
  },
  reactPin({ commit }, { pinId, reactType }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .post("pins/" + pinId + "/reacts?reactType=" + reactType)
      .then(response => {
        commit("setpinReacts", response.data.success);
      })
      .catch(error => {
        console.log(error);
      });
  },
  getPinComments({ commit }, pinId) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .get("pins/" + pinId + "/comments")
      .then(response => {
        commit("setPinComments", response.data.comments);
      })
      .catch(error => {
        console.log(error);
      });
  },
  likeComments({ commit }, { pinId, commentId }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .post("pins/" + pinId + "/comments/" + commentId + "/likes")
      .then(response => {
        commit("likeComment", response.data.success);
      })
      .catch(error => {
        console.log(error);
      });
  }
};

const getters = {
  followUser: state => state.followUser
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
