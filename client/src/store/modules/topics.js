import axios from "axios";

const state = {
  topics: []
};

const mutations = {
  setTopics(state, topics) {
    state.topics = topics;
  },
  setFollowTopics(state, { id, val }) {
    state.topics.find(x => x._id === id).isFollow = val;
  },
  demo() {}
};

const actions = {
  followTopic({ commit }, topicId) {
    axios
      .put("me/follow-topic/" + topicId)
      .then(() => {
        commit("demo");
        commit("setFollowTopics", { id: topicId, val: true });
      })
      .catch(error => {
        console.log(error);
      });
  },
  unfollowTopic({ commit }, topicId) {
    axios
      .delete("me/follow-topic/" + topicId)
      .then(() => {
        commit("demo");
        commit("setFollowTopics", { id: topicId, val: false });
      })
      .catch(error => {
        console.log(error);
      });
  },
  getTopics({ commit }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .get("topic")
      .then(response => {
        let topics = response.data;
        commit("setTopics", topics);
      })
      .catch(error => {
        console.log(error);
      });
  }
};

const getters = {
  topics: state => state.topics
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
