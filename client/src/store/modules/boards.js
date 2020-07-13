import axios from "axios";

const state = {
  userBoards:[]
};

const mutations = {
  addNewBoard(state,board){
      state.userBoards.push(board)
  },
  setBoards(state,boards){
    state.userBoards=boards
  },
};

const actions = {
    createBoard({ commit }, boardName) {
       // localStorage.setItem("x-auth-token", token);
        let token =localStorage.getItem("userToken");
        console.log(token);
        axios.defaults.headers.common["Authorization"] =token
        axios
          .post("me/boards", 
          {
              name:boardName
          }
          )
          .then((response) => {
            commit("addNewBoard", response.data);
          })
          .catch(error => {
            console.log(error)
          });
      },
      userBoards({ commit }) {
        let token =localStorage.getItem("userToken");
        console.log(token);
        axios.defaults.headers.common["Authorization"] =token
        axios
          .get("me/boards")
          .then((response) => {
            commit("setBoards", response.data);
          })
          .catch(error => {
            console.log(error)
          });
      },
};

const getters = {
    userBoards: state => state.userBoards
  };

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
