import axios from "axios";

const state = {
  recentSearch: null,
  suggestions: null,
  people: null
};

const mutations = {
  setRecentSearch(state, payload) {
    state.recentSearch = payload;
  },
  setSearchSuggestions(state, payload) {
    state.suggestions = payload;
  },
  setSearchPeople(state, payload) {
    state.people = payload;
  }
};

const actions = {
  getRecentSearch({ commit }) {
    axios
      .get(
        "/search/recentSearch",
        {},
        {
          headers: {
            Authorization: localStorage.getItem("userToken")
          }
        }
      )
      .then(response => {
        commit("setRecentSearch", response.data.recentSearch);
      })
      .catch(error => {
        console.log(error);
      });
  },
  searchPins({ commit }, payload) {
    axios
      .get(
        "/search/allPins?limit=" +
          payload.limit +
          "&offset=" +
          payload.offset +
          "&name=" +
          payload.name +
          "&recentSearch=" +
          payload.recentSearch,
        {
          headers: {
            Authorization: localStorage.getItem("userToken")
          }
        }
      )
      .then(response => {
        commit("setSearchSuggestions", response.data);
      })
      .catch(error => {
        console.log(error);
      });
  },
  searchPeople({ commit }, payload) {
    axios
      .get(
        "/search/people?limit=" +
          payload.limit +
          "&offset=" +
          payload.offset +
          "&name=" +
          payload.name +
          "&recentSearch=" +
          payload.recentSearch,
        {
          headers: {
            Authorization: localStorage.getItem("userToken")
          }
        }
      )
      .then(response => {
        commit("setSearchPeople", response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
