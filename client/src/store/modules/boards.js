import axios from "axios";

const state = {
  userBoards: [],
  chosenBoardName: "Select",
  chosenBoardId: "",
  chosenSectionId: "",
  currentBoard: {},
  collaborators: [],
  moreLike: [],
  section: {},
  viewState: "Default",
  generating: false,
  generatedCount: 0,
  offset: 0,
  maxMore: false,
  inProgress: false,
  loadingMore: false,
  first: true,
  loading: false,
  isMine: true
};

const mutations = {
  addNewBoard(state, board) {
    state.userBoards.push(board);
  },
  setBoards(state, boards) {
    state.userBoards = boards;
  },
  chooseBoard(state, { boardName, boardId, sectionId }) {
    state.chosenBoardName = boardName;
    state.chosenBoardId = boardId;
    state.chosenSectionId = sectionId;
  },
  setCurrentBoard(state, board) {
    state.currentBoard = board;
  },
  setCollaborators(state, collaborators) {
    state.collaborators = collaborators;
  },
  setMoreLike(state, more) {
    more.forEach(m => {
      state.moreLike.push(m);
    });
  },
  setCurrentSection(state, section) {
    state.section = section;
  }
};

const actions = {
  createBoard({ dispatch, state }, boardData) {
    state.chosenBoardName = boardData.name;
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .post("me/boards", boardData)
      .then(response => {
        dispatch("userBoards");
        state.chosenBoardId = response.data._id;
      })
      .catch(error => {
        console.log(error);
      });
  },
  userBoards({ commit, state }) {
    if (!state.isMine || state.first) {
      state.loading = true;
      state.userBoards = [];
      state.isMine = true;
      state.first = false;
    }
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .get("me/boards")
      .then(response => {
        commit("setBoards", response.data);
        state.loading = false;
      })
      .catch(error => {
        commit("setBoards", []);
        state.loading = false;
        console.log(error);
      });
  },
  getBoard({ commit, state }, boardId) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    let newLoad = false;
    if (!state.currentBoard.board || boardId != state.currentBoard.board._id) {
      state.currentBoard = {};
      commit("popUpsState/toggleLoadingPopup", null, { root: true });
      newLoad = true;
    }
    axios
      .get("boards/" + boardId)
      .then(response => {
        let board = response.data;
        commit("setCurrentBoard", board);
        commit("chooseBoard", {
          boardName: board.board.name,
          boardId: board.board._id,
          sectionId: ""
        });
        if (newLoad)
          commit("popUpsState/toggleLoadingPopup", null, { root: true });
      })
      .catch(error => {
        console.log(error);
        if (newLoad)
          commit("popUpsState/toggleLoadingPopup", null, { root: true });
      });
  },
  //not my boards another user boards
  getUserBoards({ commit }, userId) {
    if (state.isMine || state.first) {
      state.loading = true;
      state.userBoards = [];
      state.isMine = false;
      state.first = false;
    }
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .get("users/" + userId + "/boards")
      .then(response => {
        commit("setBoards", response.data);
        state.loading = false;
      })
      .catch(error => {
        commit("setBoards", []);
        state.loading = false;
        console.log(error);
      });
  },
  sortAz({ dispatch }) {
    axios
      .put("me/boards/sortAZ")
      .then(() => {
        dispatch("userBoards");
        dispatch("user/getUserProfile", null, { root: true });
      })
      .catch(error => {
        console.log(error);
      });
  },
  sortDate({ dispatch }) {
    axios
      .put("me/boards/sortDate")
      .then(() => {
        dispatch("userBoards");
        dispatch("user/getUserProfile", null, { root: true });
      })
      .catch(error => {
        console.log(error);
      });
  },
  reorderBoards({ dispatch }, { from, to }) {
    axios
      .put(
        "me/boards/reorderBoards?startIndex=" + from + "&positionIndex=" + to
      )
      .then(() => {
        dispatch("userBoards");
        dispatch("user/getUserProfile", null, { root: true });
      })
      .catch(error => {
        console.log(error);
      });
  },
  editBoard({ dispatch, state }, newBoard) {
    axios
      .put("me/boards/edit/" + state.chosenBoardId, newBoard)
      .then(() => {
        dispatch("getBoard", state.chosenBoardId);
        dispatch("userBoards");
        dispatch("followers/getFollowers", null, { root: true });
        dispatch("followers/getFollowing", null, { root: true });
        dispatch("getCollaborators");
      })
      .catch(error => {
        console.log(error);
      });
  },
  mergeBoard({ dispatch }, merge) {
    axios
      .put("me/boards/merge", merge)
      .then(() => {
        dispatch("userBoards");
      })
      .catch(error => {
        console.log(error);
      });
  },
  deleteBoard({ dispatch, state }) {
    axios
      .delete("me/boards/" + state.chosenBoardId)
      .then(() => {
        dispatch("userBoards");
      })
      .catch(error => {
        console.log(error);
      });
  },
  getCollaborators({ state, commit }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .get("me/boards/" + state.currentBoard.board._id + "/collaboratores")
      .then(response => {
        commit("setCollaborators", response.data);
      })
      .catch(error => {
        console.log(error);
      });
  },
  editCollaborators({ dispatch }, payload) {
    axios
      .put(
        "me/boards/" + state.currentBoard.board._id + "/collaboratores",
        payload
      )
      .then(() => {
        dispatch("getCollaborators");
      })
      .catch(error => {
        console.log(error);
      });
  },
  deletaCollaborator({ dispatch }, payload) {
    axios
      .delete(
        "me/boards/" + state.currentBoard.board._id + "/collaboratores",
        payload
      )
      .then(() => {
        dispatch("getCollaborators");
      })
      .catch(error => {
        dispatch("getCollaborators");
        console.log(error);
      });
  },
  generateMoreLike({ state }, boardId) {
    state.moreLike = [];
    state.offset = 0;
    state.generating = true;
    state.maxMore = false;
    state.loadingMore = true;
    state.inProgress = false;
    axios
      .put("more/boards/" + boardId)
      .then(reponse => {
        state.generating = false;
        state.generatedCount = reponse.data.total;
      })
      .catch(error => {
        console.log(error);
      });
  },
  async moreLike({ state, commit, dispatch }, { boardId, limit }) {
    if (!state.maxMore && !state.inProgress) {
      state.inProgress = true;
      try {
        let more = await axios.get(
          "more/boards/" +
            boardId +
            "?limit=" +
            limit +
            "&offset=" +
            state.offset
        );
        state.loadingMore = false;
        state.inProgress = false;
        state.offset += 10;
        commit("setMoreLike", more.data);
      } catch (error) {
        state.inProgress = false;
        if (error.response.status == 404) {
          let remaining = state.generatedCount - state.offset;
          if (state.generating) {
            setTimeout(() => {
              dispatch("moreLike", { boardId: boardId, limit: 10 });
            }, 1000);
          } else if (remaining > 0) {
            dispatch("moreLike", { boardId: boardId, limit: remaining });
          } else {
            state.loadingMore = false;
            state.maxMore = true;
          }
        }
        console.log(error);
      }
    }
  },
  getFullSection({ commit, state }, { boardId, sectionId }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    let newLoad = false;
    if (!state.section.section || sectionId != state.section.section._id) {
      state.section = {};
      commit("popUpsState/toggleLoadingPopup", null, { root: true });
      newLoad = true;
    }
    axios
      .get("boards/" + boardId + "/sections/" + sectionId)
      .then(response => {
        let section = response.data;
        commit("setCurrentSection", section);
        if (newLoad)
          commit("popUpsState/toggleLoadingPopup", null, { root: true });
      })
      .catch(error => {
        console.log(error);
        if (newLoad)
          commit("popUpsState/toggleLoadingPopup", null, { root: true });
      });
  },
  createSection({ dispatch }, { id, name }) {
    axios
      .post("me/boards/" + id + "/section", {
        sectionName: name
      })
      .then(() => {
        dispatch("getBoard", id);
      })
      .catch(error => {
        console.log(error);
      });
  },
  deleteSection({ dispatch }, { boardId, sectionId }) {
    axios
      .delete("me/boards/" + boardId + "/section/" + sectionId)
      .then(() => {
        dispatch("getBoard", boardId);
      })
      .catch(error => {
        console.log(error);
      });
  },
  getViewState({ state }) {
    axios
      .get("me/boards/view")
      .then(response => {
        state.viewState = response.data;
      })
      .catch(error => {
        console.log(error);
      });
  },
  setViewState({ state }, view) {
    axios
      .put("me/boards/view?viewState=" + view)
      .then(() => {
        state.viewState = view;
      })
      .catch(error => {
        console.log(error);
      });
  }
};

const getters = {
  userBoards: state => state.userBoards,
  chosenBoardName: state => state.chosenBoardName,
  chosenBoardId: state => state.chosenBoardId,
  chosenSectionId: state => state.chosenSectionId,
  currentBoard: state => state.currentBoard,
  collaborators: state => state.collaborators,
  moreLike: state => state.moreLike,
  section: state => state.section,
  viewState: state => state.viewState,
  loadingMore: state => state.loadingMore,
  loading: state => state.loading
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
