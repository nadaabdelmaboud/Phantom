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
           chat.forEach(msg=> {
            msg.owner = true;
          });
        })
        .catch(error => {
            console.log(error)
        });
        axios
        .get("/getMessagesSent/"+payload.recieverId+"/"+payload.senderId)
        .then((response) => {
           console.log(chat)
           let received=response.data;
           received.forEach(msg=> {
            msg.owner = false;
          });
           chat = chat.concat(received);
           chat.sort(function(a, b){ 
                return new Date(a.time) - new Date(b.time); 
            }); 
      
           commit("setChat",chat)
        })
        .catch(error => {
            console.log(error)
        });
    },
    sendMsg({ commit },msg){
        if(msg.note == "")
           console.log(commit)
        axios.post("/sentMessage",msg)
        .catch(error =>{
            console.log(error)
        })
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
