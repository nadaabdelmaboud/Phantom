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
    let len = state.currentChat.length;
    if (len) state.currentChat[len - 1].last = false;
    state.currentChat.push(msg);
  },
  setRecentChats(state, chats) {
    state.recentChats = chats;
  },
  setSeen(state, id) {
    let index = state.currentChat.findIndex(c => c._id == id);
    if (index != -1) state.currentChat[index].seen = true;
  },
  setDeliver(state, id) {
    let index = state.currentChat.findIndex(c => c._id == id);
    if (index != -1) state.currentChat[index].seen = true;
  }
};

const actions = {
  async getChat({ commit }, payload) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    let chat = [];
    try {
      chat = await axios.get(
        "/getMessagesSent/" + payload.recieverId+"/"+ payload.senderId
      );
      chat = chat.data;
      let lastin = [false, false];
      chat.forEach(msg => {
        if (msg.senderId == payload.senderId) {
          msg.owner = true;
          if (!lastin[0]) {
            msg.last = true;
            lastin[0] = true;
          }
        } else {
          if (!lastin[1]) {
            msg.last = true;
            lastin[1] = true;
          }
          msg.owner = false;
        }
        msg.seen = msg.seenStatus.length > 0;
        msg.deliver = msg.deliverStatus.length > 0;
      });
      chat = chat.reverse();
    } catch (err) {
      console.log(err);
    }
    commit("setChat", chat);
  },
  sendMsg({ dispatch }, msg) {
    axios
      .post("/sentMessage", msg)
      .then(() => {
        dispatch("getChat", {
          senderId: msg.senderId,
          recieverId: [msg.recieverId]
        });
      })
      .catch(error => {
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
        commit("setRecentChats", []);
      });
  },
  setAsSeen({ dispatch }, payload) {
    axios
      .post("seenDeliver", {
        senderId: payload.senderId,
        recieverId: payload.recieverId,
        time: Date.now(),
        isSeen: true
      })
      .then(() => {
        dispatch("getChat", payload);
      })
      .catch(error => {
        console.log(error);
        dispatch("getChat", payload);
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
