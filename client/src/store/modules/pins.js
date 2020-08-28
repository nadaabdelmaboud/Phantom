import axios from "axios";

const state = {
  pin: "",
  demo: "",
  pins:[]
};

const mutations = {
  setPins(state, pins){
    state.pins = pins
  }
};

const actions = {
  createPin({ state, commit, dispatch }, { pin, label }) {
    console.log(pin);
    const file = new FormData();
    file.append("file", pin.imageId);
    axios({
      method: "post",
      url: "me/uploadImage",
      data: file
    })
      .then(response => {
        pin.imageId = response.data[0].id;
        axios.post("me/pins", pin).then(response => {
          state.pin = response.data;
          console.log("here i get image id", pin.imageId);
          state.pin.imageId = pin.imageId;
          dispatch("addPinToTopic", {
            pinId: state.pin._id,
            topicName: label
          });
          commit("popUpsState/toggleNewPin", null, { root: true });
        });
      })
      .catch(error => {
        console.log(error);
      });
  },
  addPinToTopic({ state }, { pinId, topicName }) {
    axios
      .post("topic/addPin", {
        pinId: pinId,
        topicName: topicName
      })
      .then(() => {
        state.demo = "";
      })
      .catch(error => {
        console.log(error);
      });
  },
  getmySavedPins(){
    return axios.get("me/savedPins");
  },
  getmyCreatedPins(){
    return axios.get("me/pins");
  },
  async getMyPins({dispatch,commit}){
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
    let mysaved =[];
    let mycreated =[];
    try{
      mysaved = await dispatch("getmySavedPins");
      mysaved = mysaved.data;
    }
    catch(err){
      console.log(err);
    }
    try{
      mycreated = await dispatch("getmyCreatedPins");
      mycreated = mycreated.data
    }
    catch(err){
      console.log(err);
    }
    let pins = mysaved.concat(mycreated);

    pins.sort(function(a, b) {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    commit("setPins",pins);
    

  },
  getUserPins(){

  }
};

const getters = {
  pins: state => state.pins
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
