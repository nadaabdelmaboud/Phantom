import axios from "axios";

const state = {
  notifications: [],
  counter:0
};

const mutations = {
  setNotifications(state, notifications) {
    state.notifications = notifications;
  }
};

const actions = {
  notifyUser({ dispatch }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios.get("me/boardsForYou");
    axios.get("me/pinsForYou");
    axios.get("me/popularPins");
    axios.get("me/pinsRecentActivity");
    dispatch("user/getUserProfile", null, { root: true });
  },
  resetCounter({ state }){
    axios.put("me/update-notification-counter")
    .then(()=>{
      state.counter = 0;
    })
    .catch(error=>{
      console.log(error)
    })
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
