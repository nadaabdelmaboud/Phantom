import axios from "axios";

const state = {
  topics: []
};

const mutations = {
  setTopics(state, topics) {
    state.topics = topics;
  }
};

const actions = {
    followTopic(topicName){
      axios
      .put("me/follow-topic/"+topicName)
      .then(() => {
      })
      .catch(error => {
        console.log(error)
      });
    },
    unfollowTopic(topicName){
      axios
      .delete("me/follow-topic/"+topicName)
      .then(() => {
      })
      .catch(error => {
        console.log(error)
      });
    },
    getTopics({ commit }) {
        axios
          .get("topic")
          .then((response) => {
            let topics =response.data;
            commit("setTopics",topics);
          })
          .catch(error => {
            console.log(error)
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
