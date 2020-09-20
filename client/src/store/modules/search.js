import axios from "axios";

const state = {
  pins: [],
  people: [],
  keys: [],
  myPins: [],
  boards: [],
  offset: 0,
  inProgress: false,
  totalResult: 50,
  endResult: false
};

const mutations = {
  setSearchPins(state, pins) {
    pins.forEach(pin => {
      state.pins.push(pin);
    });
  },
  setSearchPeople(state, people) {
    people.forEach(person => {
      state.people.push(person);
    });
  },
  setKeys(state, payload) {
    state.keys = payload;
  },
  setSearchMyPins(state, payload) {
    state.myPins = payload;
  },
  setSearchBoards(state, boards) {
    boards.forEach(board => {
      state.boards.push(board);
    });
  },
  resetOffset(state) {
    state.offset = 0;
    state.pins = [];
    state.people = [];
    state.myPins = [];
    state.boards = [];
  }
};

const actions = {
  async searchPins({ state, commit, dispatch }, payload) {
    if (!state.inProgress && !state.endReuslt) {
      state.inProgress = true;
      try {
        let pins = await axios.get(
          "/search/allPins?limit=" +
            10 +
            "&offset=" +
            state.offset +
            "&name=" +
            payload.name,
          {
            headers: {
              Authorization: localStorage.getItem("userToken")
            }
          }
        );
        state.inProgress = false;
        state.offset += 10;
        commit("setSearchPins", pins.data);
      } catch {
        let remaining = state.totalResult - state.offset;
        state.inProgress = false;
        if (remaining > 0) {
          dispatch("searchPins", { name: payload.name });
        } else {
          state.endReuslt = true;
        }
      }
    }
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
  async searchPeople({ state, commit, dispatch }, payload) {
    if (!state.inProgress && !state.endReuslt) {
      state.inProgress = true;
      try {
        let people = await axios.get(
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
        );
        state.inProgress = false;
        state.offset += 10;
        commit("setSearchPeople", people.data);
      } catch {
        let remaining = state.totalResult - state.offset;
        state.inProgress = false;
        if (remaining > 0) {
          dispatch("searchPeople", { name: payload.name });
        } else {
          state.endReuslt = true;
        }
      }
    }
  },
  async searchBoards({ state, commit, dispatch }, payload) {
    if (!state.inProgress && !state.endReuslt) {
      state.inProgress = true;
      try {
        let boards = await axios.get(
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
        );
        state.inProgress = false;
        state.offset += 10;
        commit("setSearchBoards", boards.data);
      } catch {
        let remaining = state.totalResult - state.offset;
        state.inProgress = false;
        if (remaining > 0) {
          dispatch("searchBoards", { name: payload.name });
        } else {
          state.endReuslt = true;
        }
      }
    }
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
