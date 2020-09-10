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
  async notifyUser({ dispatch }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    await axios.get("me/boardsForYou")
    await axios.get("me/pinsForYou")
    await axios.get("me/popularPins")
    await axios.get("me/pinsRecentActivity")
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
