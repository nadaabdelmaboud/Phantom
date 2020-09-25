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
  loading: false,
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
    state.inProgress=false;
    state.pins = [];
    state.people = [];
    state.myPins = [];
    state.boards = [];
  },
  setLoading(state, payload) {
    state.loading = payload;
  },
  setSearchSuggestions(state, payload) {
    state.searchSuggestions = payload;
  }
};

const actions = {
  async searchPins({ state, commit, dispatch }, payload) {
    if (!state.inProgress && !state.endReuslt) {
      state.inProgress = true;
      commit("setLoading", true);
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
        commit("setLoading", false);
        state.inProgress = false;
        state.offset += 10;
        commit("setSearchPins", pins.data.result);
        state.totalResult = pins.data.length;
      } catch (error) {
        if (error.response.status == 404) {
          let remaining = state.totalResult - state.offset;
          state.inProgress = false;
          commit("setLoading", false);
          if (remaining > 0) {
            dispatch("searchPins", { name: payload.name });
          } else {
            state.endReuslt = true;
          }
        }
      }
    }
  },
  async searchMyPins({ state, commit, dispatch }, payload) {
    if (!state.inProgress && !state.endReuslt) {
      state.inProgress = true;
      commit("setLoading", true);
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
        commit("setLoading", false);
        state.offset += 10;
        commit("setSearchMyPins", pins.data.result);
        state.totalResult = pins.data.length;
      } catch (error) {
        if (error.response.status == 404) {
          let remaining = state.totalResult - state.offset;
          state.inProgress = false;
          commit("setLoading", false);
          if (remaining > 0) {
            dispatch("searchMyPins", { name: payload.name });
          } else {
            state.endReuslt = true;
          }
        }
      }
    }
  },
  async searchPeople({ state, commit, dispatch }, payload) {
    if ((!state.inProgress && !state.endReuslt) || payload.searchSuggestions) {
      state.inProgress = true;
      commit("setLoading", true);
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
        commit("setLoading", false);
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
      } catch (error) {
        if (error.response.status == 404) {
          let remaining = state.totalResult - state.offset;
          state.inProgress = false;
          commit("setLoading", false);
          if (remaining > 0) {
            dispatch("searchPeople", { name: payload.name });
          } else {
            state.endReuslt = true;
          }
        }
      }
    }
  },
  async searchBoards({ state, commit, dispatch }, payload) {
    if (!state.inProgress && !state.endReuslt) {
      state.inProgress = true;
      commit("setLoading", true);
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
        commit("setLoading", false);
        commit("setSearchBoards", boards.data.result);
        state.totalResult = boards.data.length;
      } catch (error) {
        if (error.response.status == 404) {
          let remaining = state.totalResult - state.offset;
          state.inProgress = false;
          commit("setLoading", false);
          if (remaining > 0) {
            dispatch("searchBoards", { name: payload.name });
          } else {
            state.endReuslt = true;
          }
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
