import axios from "axios";

const state = {
  pins: null,
  people: null,
  keys: null,
  myPins: null,
  boards: null
};

const mutations = {
  setSearchPins(state, payload) {
    state.pins = payload;
  },
  setSearchPeople(state, payload) {
    state.people = payload;
  },
  setKeys(state, payload) {
    state.keys = payload;
  },
  setSearchMyPins(state, payload) {
    state.myPins = payload;
  },
  setSearchBoards(state, payload) {
    state.boards = payload;
  }
};

const actions = {
  searchPins({ commit }, payload) {
    axios
      .get(
        "/search/allPins?limit=" +
          payload.limit +
          "&offset=" +
          payload.offset +
          "&name=" +
          payload.name,
        {
          headers: {
            Authorization: localStorage.getItem("userToken")
          }
        }
      )
      .then(response => {
        commit("setSearchPins", response.data);
      })
      .catch(error => {
        console.log(error);
      });
  },
  searchMyPins({ commit }, payload) {
    axios
      .get(
        "/search/myPins?limit=" +
          payload.limit +
          "&offset=" +
          payload.offset +
          "&name=" +
          payload.name,
        {
          headers: {
            Authorization: localStorage.getItem("userToken")
          }
        }
      )
      .then(response => {
        commit("setSearchMyPins", response.data);
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
          payload.name,
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
  },
  searchBoards({ commit }, payload) {
    axios
      .get(
        "/search/board?limit=" +
          payload.limit +
          "&offset=" +
          payload.offset +
          "&name=" +
          payload.name,
        {
          headers: {
            Authorization: localStorage.getItem("userToken")
          }
        }
      )
      .then(response => {
        commit("setSearchBoards", response.data);
      })
      .catch(error => {
        console.log(error);
      });
  },
  searchKeywords({ commit }, payload) {
    axios
      .get("/search/getkeys?name=" + payload, {
        headers: {
          Authorization: localStorage.getItem("userToken")
        }
      })
      .then(response => {
        commit("setKeys", response.data);
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
