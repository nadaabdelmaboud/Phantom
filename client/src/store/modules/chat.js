import axios from "axios";

const state = {
  currentChat: [],
  recentChats: [],
  people: [],
  offset: 0,
  inProgress: false,
  totalResult: 50,
  loading: false,
  firstCreate: 0
};

const mutations = {
  setChat(state, chat) {
    state.currentChat = chat;
  },
  addMsg(state, msg) {
    let len = state.currentChat.length;
    if (len && state.currentChat[len - 1].owner == msg.owner)
      state.currentChat[len - 1].last = false;
    state.currentChat.push(msg);
  },
  setRecentChats(state, chats) {
    state.recentChats = chats;
  },
  setState(state, newState) {
    let newChat = state.currentChat;
    newChat = newChat.reverse();
    let lastin = [false, false];
    newChat.forEach(msg => {
      msg.last = false;
      if (msg.owner) {
        if (newState == "seen") msg.seen = true;
        else msg.deliver = true;
        if (!lastin[0]) {
          msg.last = true;
          lastin[0] = true;
        }
      } else {
        if (!lastin[1]) {
          msg.last = true;
          lastin[1] = true;
        }
      }
    });
    state.currentChat = newChat.reverse();
  },
  resetOffset(state) {
    state.offset = 0;
    state.people = [];
  },
  setSearchPeople(state, people) {
    people.forEach(person => {
      state.people.push(person);
    });
  },
  socketCreated(state) {
    state.firstCreate = 1;
  }
};

const actions = {
  async getChat({ commit, state }, payload) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    let chat = [];
    if (!state.currentChat.length) state.loading = true;
    try {
      chat = await axios.get(
        "/getMessagesSent/" + payload.recieverId + "/" + payload.senderId
      );
      chat = chat.data;
      let lastin = [false, false];
      chat.forEach(msg => {
        if (msg.senderId == payload.recieverId) {
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
      state.loading = false;
    } catch (err) {
      console.log(err);
    }
    commit("setChat", chat);
    state.loading = false;
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
      .post("seen", {
        senderId: payload.senderId,
        recieverId: payload.recieverId,
        time: Date.now()
      })
      .then(() => {
        dispatch("getChat", payload);
      })
      .catch(error => {
        console.log(error);
        dispatch("getChat", payload);
      });
  },
  async searchPeople({ state, commit, dispatch }, payload) {
    if (!state.inProgress && !state.endReuslt) {
      state.inProgress = true;
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
        state.offset += 10;
        commit("setSearchPeople", people.data.result);
        state.totalResult = people.data.length;
      } catch {
        let remaining = state.totalResult - state.offset;
        state.inProgress = false;
        if (remaining > 0) {
          dispatch("searchPeople", { name: payload.name });
        } else {
          state.endReuslt = true;
        }
      }
    }
  }
};

const getters = {
  currentChat: state => state.currentChat,
  recentChats: state => state.recentChats,
  people: state => state.people,
  loading: state => state.loading
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
