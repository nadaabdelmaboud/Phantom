import axios from "axios";

const state = {
  pin: "",
  demo: ""
};

const mutations = {};

const actions = {
  createPin({ state, dispatch }, { pin, label }) {
    console.log(pin);
    const file = new FormData();
    file.append("file", pin.imageId);
    axios({
      method: "post",
      url: "me/uploadImage",
      data: file
    })
      .then(response => {
        pin.imageId = response.data.imageId;
        axios.post("me/pins", pin).then(response => {
          state.pin = response.data;
          dispatch("addPinToTopic", {
            pinId: state.pin._id,
            topicName: label
          });
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
