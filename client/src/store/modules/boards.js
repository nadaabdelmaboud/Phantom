import axios from "axios";

const state = {
  userBoards: [],
  chosenBoardName: "Select",
  chosenBoardId: "",
  chosenSectionId: "",
  currentBoard: "",
  collaborators: [],
  moreLike: [],
  section: {},
  viewState: "Default",
  generating:false,
  generatedCount:0,
  offset:0
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
    // localStorage.setItem("x-auth-token", token);
    state.chosenBoardName = boardData.name;
    let token = localStorage.getItem("userToken");
    console.log(token);
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
  userBoards({ commit }) {
    let token = localStorage.getItem("userToken");
    console.log(token);
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .get("me/boards")
      .then(response => {
        console.log(response.data);
        commit("setBoards", response.data);
      })
      .catch(error => {
        commit("setBoards", []);
        console.log(error);
      });
  },
  getBoard({ commit }, boardId) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
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
      })
      .catch(error => {
       
        console.log(error);
      });
  },
  //not my boards another user boards
  getUserBoards({ commit }, userId) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .get("users/" + userId + "/boards")
      .then(response => {
        commit("setBoards", response.data);
      })
      .catch(error => {
        commit("setBoards", []);
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
  async moreLike({ state, commit },{ boardId,generate }) {
    if(generate || !state.generating){
      state.generating = true;
      state.offset =0;
      if(state.offset+8 > state.generatedCount)
      {
        axios.put("more/boards/" + boardId)
        .then((reponse)=>{
          state.generating =false;
          state.generatedCount = reponse.data.total
        })
        .catch(error=>{
          console.log(error)
        })
      }
    }
    axios
      .get("more/boards/" + boardId +"?limit=8&offset="+ state.offset)
      .then(response => {
        commit("setMoreLike", response.data);
      })
      .catch(error => {
        console.log(error);
      });

      state.offset +=8;
  },
  getFullSection({ commit }, { boardId, sectionId }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .get("boards/" + boardId + "/sections/" + sectionId)
      .then(response => {
        let section = response.data;
        commit("setCurrentSection", section);
      })
      .catch(error => {
        console.log(error);
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
  viewState: state => state.viewState
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
