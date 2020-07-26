import axios from "axios";

const state = {
  pin: "",
  demo: ""
};

const mutations = {};

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
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
