import axios from "axios";

const state = {
  userFollowers: [],
  userFollowing: []
};

const mutations = {
  setFollowers(state, followers) {
    state.userFollowers = followers;
  },
  setFollowing(state,following){
    state.userFollowing = following;
  }
};

const actions = {
    followUser({ dispatch },userId){
      axios
      .put("me/follow-user/"+userId)
      .then(() => {
       dispatch("getFollowing")
       dispatch("getFollowers")
       dispatch("phantomUser/isFollowed",userId,{root:true});
      })
      .catch(error => {
        console.log(error)
      });
    },
    unfollowUser({ dispatch },userId){
      axios
      .delete("me/follow-user/"+userId)
      .then(() => {
       dispatch("getFollowing")
       dispatch("getFollowers");
       dispatch("phantomUser/isFollowed",userId,{root:true});
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
      },
      getFollowing({ commit }) {
        axios
          .get("me/following")
          .then((response) => {
            let following =response.data.followings
            commit("setFollowing",following);
          })
          .catch(error => {
            console.log(error)
          });
      }
};

const getters = {
  userFollowers: state => state.userFollowers,
  userFollowing: state => state.userFollowing
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
