import axios from "axios";

const state = {
  topics: [],
  topicsLoading: false
};

const mutations = {
  setTopics(state, topics) {
    state.topics = topics;
  },
  setFollowTopics(state, { id, val }) {
    state.topics.find(x => x._id === id).isFollow = val;
  }
};

const actions = {
  async followTopic({ commit }, topicId) {
    try {
      await axios.put("me/follow-topic/" + topicId);
      commit("setFollowTopics", { id: topicId, val: true });
    } catch (error) {
      console.log(error);
    }
  },
  async unfollowTopic({ commit }, topicId) {
    try {
      await axios.delete("me/follow-topic/" + topicId);
      commit("setFollowTopics", { id: topicId, val: false });
    } catch (error) {
      console.log(error);
    }
  },
  getTopics({ commit }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    state.topicsLoading = true;
    axios
      .get("topic")
      .then(response => {
        let topics = response.data;
        commit("setTopics", topics);
        state.topicsLoading = false;
      })
      .catch(error => {
        console.log(error);
        state.topicsLoading = false;
      });
  }
};

const getters = {
  topics: state => state.topics,
  topicsLoading: state => state.topicsLoading
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
