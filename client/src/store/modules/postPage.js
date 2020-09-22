import axios from "axios";

const state = {
  addCommentObject: {},
  addReplyObject: {},
  followUser: false,
  react: false,
  pinComments: [],
  likeComment: false,
  likeReply: false,
  morePins: [],
  generating: false,
  generatedCount: 0,
  offset: 0,
  maxMore: false,
  inProgress: false
};

const mutations = {
  commentIsAdded(state, comment) {
    state.addCommentObject = comment;
  },
  replyIsAdded(state, reply) {
    state.addReplyObject = reply;
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
  },
  likeReply(state, like) {
    state.likeReply = like;
  },
  addNewReply(state, { reply, commentId }) {
    state.pinComments.find(x => x.comment.id === commentId).replies.push(reply);
  },
  setmorePins(state, pins) {
    for (let index = 0; index < pins.length; index++)
      state.morePins.push(pins[index]);
  }
};

const actions = {
  moreLikeThisPin({ state }, pinId) {
    state.morePins = [];
    state.offset = 0;
    state.generating = true;
    state.maxMore = false;
    axios
      .put("more/pins/" + pinId)
      .then(response => {
        state.generating = false;
        state.generatedCount = response.data.total;
      })
      .catch(error => {
        console.log(error);
      });
  },
  async generateMorePins({ state, commit, dispatch }, { pinId, limit }) {
    if (!state.maxMore && !state.inProgress) {
      state.inProgress = true;
      try {
        let morePins = await axios.get(
          "more/pins/" + pinId + "?limit=" + limit + "&offset=" + state.offset
        );
        state.inProgress = false;
        state.offset += 10;
        commit("setmorePins", morePins.data);
      } catch (error) {
        let remaining = state.generatedCount - state.offset;
        state.inProgress = false;
        if (state.generating) {
          setTimeout(() => {
            dispatch("generateMorePins", { pinId: pinId, limit: 10 });
          }, 1000);
        } else if (remaining > 0) {
          dispatch("generateMorePins", { pinId: pinId, limit: remaining });
        } else {
          state.maxMore = true;
        }
        console.log(error);
      }
    }
  },
  async postPageAddedComments({ commit }, { postPageId, comment }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    await axios
      .post("pins/" + postPageId + "/comments", comment)
      .then(response => {
        commit("commentIsAdded", response.data);
      })
      .catch(error => {
        console.log(error);
      });
  },
  async postPageAddedReplies({ commit }, { postPageId, commentId, reply }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    await axios
      .post("pins/" + postPageId + "/comments/" + commentId + "/replies", reply)
      .then(response => {
        commit("replyIsAdded", response.data);
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
  likeComments({ commit }, { pinId, commentId, likeCondition }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .post("pins/" + pinId + "/comments/" + commentId + "/likes")
      .then(response => {
        commit("likeComment", response.data.success);
        if (likeCondition == "like")
          state.pinComments.find(x => x.comment.id === commentId).comment.likes
            .counts++;
        else if (likeCondition == "unLike")
          state.pinComments.find(x => x.comment.id === commentId).comment.likes
            .counts--;
      })
      .catch(error => {
        console.log(error);
      });
  },
  likeReplies({ commit }, { pinId, commentId, replyId, likeCondition }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .post(
        "pins/" +
          pinId +
          "/comments/" +
          commentId +
          "/replies/" +
          replyId +
          "/likes"
      )
      .then(response => {
        commit("likeReply", response.data.success);
        if (likeCondition == "like")
          state.pinComments
            .find(x => x.comment.id === commentId)
            .replies.find(y => y.id === replyId).likes.counts++;
        else if (likeCondition == "unLike")
          state.pinComments
            .find(x => x.comment.id === commentId)
            .replies.find(y => y.id === replyId).likes.counts--;
      })
      .catch(error => {
        console.log(error);
      });
  }
};

const getters = {
  followUser: state => state.followUser,
  morePins: state => state.morePins
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
