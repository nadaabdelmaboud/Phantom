import axios from "axios";

const state = {
  userFollowers: []
};

const mutations = {
  setFollowers(state, followers){
    state.userFollowers= followers;
  }
};

const actions = {
    followUser({ dispatch },userId){
      axios
      .put("me/follow-user/"+userId)
      .then(() => {
       dispatch("getFollowers")
      })
      .catch(error => {
        console.log(error)
      });
    },
    unfollowUser({ dispatch },userId){
      axios
      .delete("me/follow-user/"+userId)
      .then(() => {
       dispatch("getFollowers")
      })
      .catch(error => {
        console.log(error)
      });
    },
    getFollowers({ commit }) {
        axios
          .get("me/follower")
          .then((response) => {
            let followers =response.data.followers
            commit("setFollowers",followers);
          })
          .catch(error => {
            console.log(error)
          });
      }
};

const getters = {
  userFollowers: state => state.userFollowers
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
