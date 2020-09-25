import axios from "axios";

const state = {
  All: [],
  Trending: [],
  Topics: [],
  following: []
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
  },
  setfollowInAll(state, id) {
    state.All.find(x => x.user._id === id).user.followers++;
  },
  setunfollowInAll(state, id) {
    state.All.find(x => x.user._id === id).user.followers--;
  },
  setfollowInTrending(state, id) {
    state.Trending.find(x => x.user._id === id).user.followers++;
  },
  setunfollowInTrending(state, id) {
    state.Trending.find(x => x.user._id === id).user.followers--;
  },
  setfollowInTopics(state, id) {
    state.Topics.find(x => x._id === id).followers++;
  },
  setunfollowInTopics(state, id) {
    state.Topics.find(x => x._id === id).followers--;
  },
  setFollowing(state, follow) {
    state.following = follow;
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
  },
  followPinCreator({ commit }, { pinCreatorId, type }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .put("me/follow-user/" + pinCreatorId)
      .then(() => {
        if (type == "All") commit("setfollowInAll", pinCreatorId);
        else if (type == "Trending")
          commit("setfollowInTrending", pinCreatorId);
        else if (type == "Topics") commit("setfollowInTopics", pinCreatorId);
      })
      .catch(error => {
        console.log(error);
      });
  },
  unFollowPinCreator({ commit }, { pinCreatorId, type }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .delete("me/follow-user/" + pinCreatorId)
      .then(() => {
        if (type == "All") commit("setunfollowInAll", pinCreatorId);
        else if (type == "Trending")
          commit("setunfollowInTrending", pinCreatorId);
        else if (type == "Topics") commit("setunfollowInTopics", pinCreatorId);
      })
      .catch(error => {
        console.log(error);
      });
  },
  followingPage({ commit }) {
    axios
      .get("me/followings/pins")
      .then(response => {
        console.log("data nihal", response.data);
        commit("setFollowing", response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }
};

const getters = {
  All: state => state.All,
  Trending: state => state.Trending,
  Topics: state => state.Topics,
  following: state => state.following
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
