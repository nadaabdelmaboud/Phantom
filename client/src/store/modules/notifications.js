import axios from "axios";

const state = {
 notifications:[]
};

const mutations = {
  setNotifications(state, notifications) {
    state.notifications = notifications;
  }
};

const actions = {
  getUser({ commit }, userId) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .get("user/" + userId)
      .then(response => {
        commit("setUser", response.data.user);
      })
      .catch(error => {
        console.log(error);
      });
  }
};

const getters = {
  notifications: state => state.notifications
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
