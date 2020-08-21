import axios from "axios";

const state = {
  topics: []
};

const mutations = {
  setTopics(state, topics) {
    state.topics = topics;
  },
  demo(){

  }
};

const actions = {
    followTopic({commit},topicName){
      axios
      .put("me/follow-topic/"+topicName)
      .then(() => {
        commit("demo")
      })
      .catch(error => {
        console.log(error)
      });
    },
    unfollowTopic({ commit },topicName){
      axios
      .delete("me/follow-topic/"+topicName)
      .then(() => {
        commit("demo")
      })
      .catch(error => {
        console.log(error)
      });
    },
    getTopics({ commit }) {
      let token = localStorage.getItem("userToken");
      axios.defaults.headers.common["Authorization"] = token;
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
