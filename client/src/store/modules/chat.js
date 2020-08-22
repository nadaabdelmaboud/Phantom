import axios from "axios";

const state = {
    currentChat: []
};

const mutations = {
  setChat(state, chat){
    state.currentChat= chat;
  },
  addMsg(state,msg){
    state.currentChat.push(msg);
  }
};

const actions = {
    getChat({ commit },payload){
        let token =localStorage.getItem("userToken");
        axios.defaults.headers.common["Authorization"] =token
        let chat=[];
        axios
        .get("/getMessagesSent/"+payload.senderId+"/"+payload.recieverId)
        .then((response) => {
           chat = response.data;
        })
        .catch(error => {
            console.log(error)
        });
        axios
        .get("/getMessagesSent/"+payload.recieverId+"/"+payload.senderId)
        .then((response) => {
            console.log(chat)
           chat = chat.concat(response.data);
           commit("setChat",chat)
        })
        .catch(error => {
            console.log(error)
        });
    },
    sendMsg({ commit },msg){
        commit("addMsg",msg);
        axios.post("/sentMessage",msg)
    }
};

const getters = {
  currentChat: state => state.currentChat,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
