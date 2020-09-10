import axios from "axios";

const state = {
  notifications: [],
};

const mutations = {
  setNotifications(state, notifications) {
    state.notifications = notifications;
  },
};

const actions = {
  notifyUser({ dispatch }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios.get("me/boardsForYou")
    axios.get("me/pinsForYou")
    axios.get("me/popularPins")
    axios.get("me/pinsRecentActivity")
    dispatch("user/getUserProfile",null,{root:true});
  },
};

const getters = {
  notifications: (state) => state.notifications,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
