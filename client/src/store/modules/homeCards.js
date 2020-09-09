import axios from "axios";
let num;
const state = {
  homeCards: [],
  postImage: "",
  userImage: "",
  postTitle: "",
  postDescribtion: "",
  userFirstName: "",
  userLastName: "",
  numberofFollowers: 0,
  pinCreatorId: "",
  cardsGenerated: false,
  offsetnum: 0,
  totalCards: 0,
  finishCalling: false,
  requestFinished: false,
};

const mutations = {
  sethomeCards(state, cards) {
    for (let index = 0; index < cards.length; index++)
      state.homeCards.push(cards[index]);
  },
  homeGenerated(state, check) {
    state.cardsGenerated = check;
  },
  setpostImage(state, postImage) {
    state.postImage = postImage;
  },
  setpostTitle(state, postTitle) {
    state.postTitle = postTitle;
  },
  setpostDescribtion(state, postDescribtion) {
    state.postDescribtion = postDescribtion;
  },
  setuserImage(state, userImage) {
    state.userImage = userImage;
  },
  setuserFirstName(state, userFirstName) {
    state.userFirstName = userFirstName;
  },
  setuserLastName(state, userLastName) {
    state.userLastName = userLastName;
  },
  setnumberofFollowers(state, numberofFollowers) {
    state.numberofFollowers = numberofFollowers;
  },
  setpinCreatorId(state, pinCreatorId) {
    state.pinCreatorId = pinCreatorId;
  },
  totalNumCards(state, totalNum) {
    state.totalCards = totalNum;
  },
  finishCalling(state, value) {
    state.finishCalling = value;
  },
  setRequestFinished(state, check) {
    state.requestFinished = check;
  },
};

const actions = {
  userHome({ commit }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    num = state.offsetnum - 12;
    state.totalCards = 0;
    axios
      .put("home/me")
      .then((response) => {
        console.log("totalllllllllllllllllllllllllllll", response.data.total);
        commit("homeGenerated", true);
        commit("totalNumCards", response.data.total);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  async userGenerateCards({ commit }) {
    commit("setRequestFinished", false);
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    num += 12;
    console.log("state.requestFinished", state.requestFinished);
    await axios
      .get("me/home?limit=12&offset=" + num)
      .then((response) => {
        commit("sethomeCards", response.data);
        commit("setRequestFinished", true);
        console.log("state.requestFinished", state.requestFinished);
      })
      .catch((error) => {
        // state.requestFinished = false;
        if (num == state.totalCards) state.finishCalling = true;
        setTimeout(() => {
          this.userGenerateCards;
        }, 3000);
        console.log(error);
      });
  },

  async Postpage({ commit }, postPageID) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    await axios
      .get("/pins/" + postPageID)
      .then((response) => {
        let res = response.data;
        commit("setpostImage", res.pin.imageId);
        commit("setpinCreatorId", res.pin.creator.id);
        commit("setpostTitle", res.pin.title);
        commit("setpostDescribtion", res.pin.note);
        commit("setuserFirstName", res.pin.creator.firstName);
        commit("setuserLastName", res.pin.creator.lastName);
        commit("setuserImage", res.creatorInfo.creatorImage);
        commit("setnumberofFollowers", res.creatorInfo.followers);
      })
      .catch((error) => {
        console.log(error);
      });
  },
};

const getters = {
  userHomePage: (state) => state.homeCards,
  postImage: (state) => state.postImage,
  userImageId: (state) => state.userImage,
  postTitle: (state) => state.postTitle,
  postDescribtion: (state) => state.postDescribtion,
  userFirstName: (state) => state.userFirstName,
  userLastName: (state) => state.userLastName,
  numberofFollowers: (state) => state.numberofFollowers,
  pinCreatorId: (state) => state.pinCreatorId,
  finishCalling: (state) => state.finishCalling,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
