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
  deletePin: false,
  cardImageId: "",
  CardId: "",
  reportPin: "",
  pinId: "",
  numReactHaha: 0,
  numReactWow: 0,
  numReactLove: 0,
  numReactGoodIdea: 0,
  numReactThanks: 0,
  reactThisPin: "",
  ChoosenBoardName: "",
  showToastState: false,
  pinType: "",
  showCreatedPinInfo: false,
  showSavedPinInfo: false,
  showUnSaveBtn: false,
  showDeleteBtn: false,
  boardId: "",
  sectionId: "",
  unsavePin: false,
  editpincase: false
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
  deletePin(state, check) {
    state.deletePin = check;
  },
  setCardImageId(state, id) {
    state.cardImageId = id;
  },
  setCardId(state, id) {
    console.log("Home id", id);
    state.CardId = id;
  },
  reportPin(state, check) {
    state.reportPin = check;
  },
  setPinId(state, id) {
    state.pinId = id;
  },
  setNumReactHaha(state, react) {
    console.log("mutation react", react);
    state.numReactHaha = react;
  },
  setNumReactWow(state, react) {
    state.numReactWow = react;
  },
  setNumReactLove(state, react) {
    state.numReactLove = react;
  },
  setNumReactGoodIdea(state, react) {
    state.numReactGoodIdea = react;
  },
  setNumReactThanks(state, react) {
    state.numReactThanks = react;
  },
  setReactThisPin(state, react) {
    console.log("react", react);
    state.reactThisPin = react;
  },
  setChoosenBoardName(state, name) {
    state.ChoosenBoardName = name;
  },
  setShowToastState(state, toast) {
    state.showToastState = toast;
  },
  setPinType(state, type) {
    state.pinType = type;
  },
  setSavedPinInfo(state, value) {
    state.showSavedPinInfo = value;
  },
  setCreatedPinInfo(state, value) {
    state.showCreatedPinInfo = value;
  },
  setshowUnSaveBtn(state, value) {
    state.showUnSaveBtn = value;
  },
  setshowDeleteBtn(state, value) {
    state.showDeleteBtn = value;
  },
  setBoardId(state, id) {
    state.boardId = id;
  },
  setSectionId(state, id) {
    state.sectionId = id;
  },
  unsavePin(state, value) {
    state.unsavePin = value;
  },
  editPin(state, value) {
    state.editpincase = value;
  }
};

const actions = {
  userHome({ commit }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    num = state.offsetnum - 12;
    state.totalCards = 0;
    axios
      .put("home/me")
      .then(response => {
        console.log("totalllllllllllllllllllllllllllll", response.data.total);
        commit("homeGenerated", true);
        commit("totalNumCards", response.data.total);
      })
      .catch(error => {
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
      .then(response => {
        commit("sethomeCards", response.data);
        commit("setRequestFinished", true);
        console.log("state.requestFinished", state.requestFinished);
      })
      .catch(error => {
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
      .then(response => {
        let res = response.data;
        commit("setpostImage", res.pin.imageId);
        commit("setpinCreatorId", res.pin.creator.id);
        commit("setpostTitle", res.pin.title);
        commit("setpostDescribtion", res.pin.note);
        commit("setuserFirstName", res.pin.creator.firstName);
        commit("setuserLastName", res.pin.creator.lastName);
        commit("setuserImage", res.creatorInfo.creatorImage);
        commit("setnumberofFollowers", res.creatorInfo.followers);
        commit("setPinId", res.pin._id);
        commit("setReactThisPin", res.react);
        commit("setNumReactHaha", res.pin.counts.hahaReacts);
        commit("setNumReactWow", res.pin.counts.wowReacts);
        commit("setNumReactLove", res.pin.counts.loveReacts);
        commit("setNumReactGoodIdea", res.pin.counts.goodIdeaReacts);
        commit("setNumReactThanks", res.pin.counts.thanksReacts);
        commit("setPinType", res.type);
      })
      .catch(error => {
        console.log(error);
      });
  },
  deletePin({ commit }, pinId) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .delete("me/pins/" + pinId)
      .then(() => {
        commit("deletePin", true);
      })
      .catch(error => {
        console.log(error);
      });
  },
  reportPin({ commit }, { pinId, reportReason }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    console.log("ReportReason", reportReason);
    axios
      .post("pins/" + pinId + "/report", reportReason)
      .then(() => {
        commit("reportPin", true);
      })
      .catch(error => {
        console.log(error);
      });
  },
  async getPinType({ commit }, pinId) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    await axios
      .get("pins/status/" + pinId)
      .then(res => {
        commit("setPinType", res.data.type);
        commit("setChoosenBoardName", res.data.board);
        commit("setBoardId", res.data.boardId);
        commit("setSectionId", res.data.sectionId);
      })
      .catch(error => {
        console.log(error);
      });
  },
  unSavePinInSection({ commit }, { pinId, boardId, sectionId }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .delete(
        "me/savedPins/" +
          pinId +
          "?sectionId=" +
          sectionId +
          "&boardId=" +
          boardId
      )
      .then(() => {
        commit("unsavePin", true);
      })
      .catch(error => {
        console.log(error);
      });
  },
  unSavePinInBoard({ commit }, { pinId, boardId }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .delete("me/savedPins/" + pinId + "?boardId=" + boardId)
      .then(() => {
        commit("unsavePin", true);
      })
      .catch(error => {
        console.log(error);
      });
  },
  editSavedPin({ commit }, { pinId, info }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .put("me/savedPins/" + pinId, info)
      .then(() => {
        commit("editPin", true);
      })
      .catch(error => {
        console.log(error);
      });
  },
  editCreatedPin({ commit }, { pinId, info }) {
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    axios
      .put("me/pins/" + pinId, info)
      .then(() => {
        commit("editPin", true);
      })
      .catch(error => {
        console.log(error);
      });
  }
};

const getters = {
  userHomePage: state => state.homeCards,
  postImage: state => state.postImage,
  userImageId: state => state.userImage,
  postTitle: state => state.postTitle,
  postDescribtion: state => state.postDescribtion,
  userFirstName: state => state.userFirstName,
  userLastName: state => state.userLastName,
  numberofFollowers: state => state.numberofFollowers,
  pinCreatorId: state => state.pinCreatorId,
  finishCalling: state => state.finishCalling,
  pinId: state => state.pinId
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
