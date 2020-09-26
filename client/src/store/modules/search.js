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
  endResult: false,
  pinsLoading: false,
  mypinsLoading: false,
  boardsLoading: false,
  peopleLoading: false,
  searchSuggestions: null
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
  setSearchMyPins(state, myPins) {
    myPins.forEach(pin => {
      state.myPins.push(pin);
    });
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
  },
  setpinsLoading(state, payload) {
    state.pinsLoading = payload;
  },
  setmyPinsLoading(state, payload) {
    state.mypinsLoadingpins = payload;
  },
  setpeopleLoading(state, payload) {
    state.peopleLoading = payload;
  },
  setboardsLoading(state, payload) {
    state.boardsLoading = payload;
  },
  setSearchSuggestions(state, payload) {
    state.searchSuggestions = payload;
  }
};

const actions = {
  async searchPins({ state, commit, dispatch }, payload) {
    if (!state.inProgress && !state.endReuslt) {
      state.inProgress = true;
      commit("setpinsLoading", true);
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
        commit("setpinsLoading", false);
        state.inProgress = false;
        state.offset += 10;
        commit("setSearchPins", pins.data.result);
        state.totalResult = pins.data.length;
      } catch {
        let remaining = state.totalResult - state.offset;
        state.inProgress = false;
        commit("setpinsLoading", false);
        if (remaining > 0) {
          dispatch("searchPins", { name: payload.name });
        } else {
          state.endReuslt = true;
        }
      }
    }
  },
  async searchMyPins({ state, commit, dispatch }, payload) {
    if (!state.inProgress && !state.endReuslt) {
      state.inProgress = true;
      commit("setmyPinsLoading", true);
      try {
        let pins = await axios.get(
          "/search/myPins?limit=10" +
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
        commit("setmyPinsLoading", false);
        state.offset += 10;
        commit("setSearchMyPins", pins.data.result);
        state.totalResult = pins.data.length;
      } catch {
        let remaining = state.totalResult - state.offset;
        state.inProgress = false;
        commit("setmyPinsLoading", false);
        if (remaining > 0) {
          dispatch("searchMyPins", { name: payload.name });
        } else {
          state.endReuslt = true;
        }
      }
    }
  },
  async searchPeople({ state, commit, dispatch }, payload) {
    if ((!state.inProgress && !state.endReuslt) || payload.searchSuggestions) {
      state.inProgress = true;
      commit("setpeopleLoading", true);
      try {
        let people = await axios.get(
          "/search/people?limit=10" +
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
        commit("setpeopleLoading", false);
        state.offset += 10;
        if (payload.searchSuggestions) {
          let suggestions = [];
          let n = 0;
          people.data.result.forEach(one => {
            if (n < 3) {
              suggestions.push(one);
              n++;
            }
          });
          commit("setSearchSuggestions", suggestions);
        } else commit("setSearchPeople", people.data.result);
        state.totalResult = people.data.length;
      } catch {
        let remaining = state.totalResult - state.offset;
        state.inProgress = false;
        commit("setpeopleLoading", false);
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
      commit("setboardsLoading", true);
      try {
        let boards = await axios.get(
          "/search/board?limit=10" +
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
        commit("setboardsLoading", false);
        commit("setSearchBoards", boards.data.result);
        state.totalResult = boards.data.length;
      } catch {
        let remaining = state.totalResult - state.offset;
        state.inProgress = false;
        commit("setboardsLoading", false);
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
