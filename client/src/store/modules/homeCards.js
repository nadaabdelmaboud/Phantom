import axios from "axios";

const state = {
  homeCards: [],
  postImage:"",
  userImage:"",
  postTitle:"",
  postDescribtion:"",
  userFirstName:"",
  userLastName:"",
  numberofFollowers:0,
};

const mutations = {
  sethomeCards(state, cards) {
    state.homeCards = cards;
  },
  setpostImage(state, postImage) {
    state.postImage = postImage;
  },
  setpostTitle(state,postTitle){
    state.postTitle=postTitle;
  },
  setpostDescribtion(state,postDescribtion){
    state.postDescribtion=postDescribtion;
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
    console.log(token);
    console.log("Nihallll");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .get("me/pins")
      .then((response) => {
        commit("sethomeCards", response.data);
        commit("setpostImage", response.data.imageId);
        commit("setpostTitle", response.data.title);
        commit("setpostDescribtion", response.data.note);
        commit("setuserImage", response.data.creator.id);
        commit("setuserFirstName", response.data.creator.firstName);
        commit("setuserLastName", response.data.creator.lastName);
      })
      .catch((error) => {
        console.log(error);
      });
  },
};

const getters = {
  userHomePage: (state) => state.homeCards,
  postImage: (state) => state.postImage,
  userImage: (state) => state.userImage,
  postTitle: (state) => state.postTitle,
  postDescribtion: (state) => state.postDescribtion,
  userFirstName: (state) => state.userFirstName,
  userLastName: (state) => state.userLastName,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
