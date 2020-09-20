import axios from "axios";

const state = {
  notifications: {
    notifications: [],
    notificationCounter: 0
  },
  show: false
};

const mutations = {
  setNotifications(state, notifications) {
    state.notifications.notifications = [];
    notifications.notifications.forEach(n => {
      if (typeof n.data == "undefined") {
        n.isPins = true;
        state.notifications.notifications.push(n);
      } else {
        n.isPins = false;
        state.notifications.notifications.push(n.data);
      }
    });
    state.notifications.notifications.reverse();
    state.notifications.notificationCounter = notifications.notificationCounter;
  },
  alterShow(state, show) {
    if (show == false) state.show = show;
    else state.show = !state.show;
  },
  setCounter(state,add){
    if(!add)
    state.notifications.notificationCounter=0;
    else
    {
      console.log("nnn")
      state.notifications.notificationCounter+=1;
    }
  }
};

const actions = {
  getNotifications({ commit },inLogin) {
    axios
      .get("notifications/me")
      .then(response => {
        let notifications= response.data
        if(!inLogin){
          notifications.notificationCounter=0;
        }
        commit("setNotifications", notifications);
      })
      .catch(error => {
        console.log(error);
      });
  },
  notifyUser({ dispatch }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios.get("me/boardsForYou");
    axios.get("me/pinsForYou");
    axios.get("me/popularPins");
    axios.get("me/pinsRecentActivity");
    dispatch("getNotifications",true);
  }
};

const getters = {
  notifications: state => state.notifications,
  show: state => state.show
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
