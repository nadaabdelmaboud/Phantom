import axios from "axios";

const state = {
  homeCards: [],
};

const mutations = {
  sethomeCards(state, cards) {
    state.homeCards = cards;
  }
};

const actions = {
  userHome({ commit }) {
    let token = localStorage.getItem("userToken");
    console.log(token);
    console.log("Nihallll")
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .get("me/pins")
      .then(response => {
        commit("sethomeCards", response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }
};

const getters = {
  userHomePage: state => state.homeCards,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
