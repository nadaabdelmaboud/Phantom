import axios from "axios";

const state = {
  user: [],
  isFollowed:false
};

const mutations = {
  setUser(state, followers){
    state.userFollowers= followers;
  },
  setIsFollowed(state,isFollowed){
    state.isFollowed = isFollowed;
  }
};

const actions = {
    getUser({ commit },userId){
      axios
      .get("user/"+ userId)
      .then((response) => {
       commit("setUser",response.data)
      })
      .catch(error => {
        console.log(error)
      });
    },
    isFollowed({ commit },userId){
      axios
      .get("me/follow-user/"+userId)
      .then((response) => {
       commit("setIsFollowed",response.data.follow)
      })
      .catch(error => {
        console.log(error)
      });
    }
};

const getters = {
  user: state => state.user
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
