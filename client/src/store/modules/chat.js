import axios from "axios";

const state = {
  currentChat: [],
};

const mutations = {
  setChat(state, chat) {
    state.currentChat = chat;
  },
  addMsg(state, msg) {
    state.currentChat.push(msg);
  },
};

const actions = {
  async getChat({ commit }, payload) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    let chat = [];
    try {
      chat = await axios.get(
        "/getMessagesSent/" + payload.senderId + "/" + payload.recieverId
      );
      chat = chat.data;
      chat.forEach((msg) => {
        msg.owner = true;
      });
    } catch (err) {
      console.log(err);
    }
    let received;
    try {
      received = await axios.get(
        "/getMessagesSent/" + payload.recieverId + "/" + payload.senderId
      );
      received = received.data;
      received.forEach((msg) => {
        msg.owner = true;
      });
      received.forEach((msg) => {
        msg.owner = false;
      });
      chat = chat.concat(received);
      chat.sort(function(a, b) {
        return new Date(a.time) - new Date(b.time);
      });
    } catch (err) {
      console.log(err);
    }
    commit("setChat", chat);
  },
  sendMsg({ commit }, msg) {
    if (msg.note == "") console.log(commit);
    axios.post("/sentMessage", msg).catch((error) => {
      console.log(error);
    });
  },
};

const getters = {
  currentChat: (state) => state.currentChat,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
