import axios from "axios";

const state = {
  userBoards:[],
  chosenBoardName:"Select",
  chosenBoardId:""
};

const mutations = {
  addNewBoard(state,board){
      state.userBoards.push(board)
  },
  setBoards(state,boards){
    state.userBoards=boards
  },
  chooseBoard(state,{name,id}){
      state.chosenBoardName =name,
      state.chosenBoardId =id
  }
};

const actions = {
    createBoard({ commit ,state }, boardName) {
       // localStorage.setItem("x-auth-token", token);
        state.chosenBoardName = boardName;
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
            state.chosenBoardId = response.data._id
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
      sortAz({commit}){
        axios.put("me/boards/sortAZ")
        .then((response)=>{
          commit("setBoards", response.data);
        })
        .catch(error => {
          console.log(error)
        });
      },
      sortDate({commit}){
        axios.put("me/boards/sortDate")
        .then((response)=>{
          commit("setBoards", response.data);
        })
        .catch(error => {
          console.log(error)
        });
      }
};

const getters = {
    userBoards: state => state.userBoards,
    chosenBoardName: state => state.chosenBoardName,
    chosenBoardId: state => state.chosenBoardId
  };

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
