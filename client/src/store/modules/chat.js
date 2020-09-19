import axios from "axios";

const state = {
  currentChat: [],
  recentChats: []
};

const mutations = {
  setChat(state, chat) {
    state.currentChat = chat;
  },
  addMsg(state, msg) {
    state.currentChat.push(msg);
  },
  setRecentChats(state, chats) {
    state.recentChats = chats;
  }
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
      chat.forEach(msg => {
        if (msg.senderId == payload.senderId) msg.owner = true;
        else msg.owner = false;
      });
    } catch (err) {
      console.log(err);
    }
    commit("setChat", chat);
  },
  sendMsg({ commit }, msg) {
    if (msg.note == "") console.log(commit);
    axios.post("/sentMessage", msg).catch(error => {
      console.log(error);
    });
  },
  getRecentChats({ commit }, userId) {
    axios
      .get("getChats/" + userId)
      .then(response => {
        commit("setRecentChats", response.data);
      })
      .catch(error => {
        console.log(error);
      });
  },
  setAsSeen({ disatch }, payload) {
    axios
      .post("seenDeliver", {
        senderId: payload.senderId,
        recieverId: payload.recieverId,
        time: Date.now(),
        isSeen: true
      })
      .then(() => {
        disatch("getChat", payload);
      })
      .catch(error => {
        console.log(error);
      });
  }
};

const getters = {
  currentChat: state => state.currentChat,
  recentChats: state => state.recentChats
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
