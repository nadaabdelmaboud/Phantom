import axios from "axios";

const state = {
  homeCards: [],
  postImage: "",
  userImage: "",
  postTitle: "",
  postDescribtion: "",
  userFirstName: "",
  userLastName: "",
  numberofFollowers: 0,
};

const mutations = {
  sethomeCards(state, cards) {
    state.homeCards = cards;
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
};

const actions = {
  userHome({ commit }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .get("me/home")
      .then((response) => {
        commit("sethomeCards", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  Postpage({ commit }, postPageID) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .get("/pins/" + postPageID)
      .then((response) => {
        let res = response.data;
        commit("setpostImage", res.pin.imageId);
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
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
