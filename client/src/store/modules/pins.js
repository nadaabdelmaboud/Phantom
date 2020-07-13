import axios from "axios";

const state = {
  pin: "",
};

const mutations = {};

const actions = {
  createPin({ state }, pin) {
    console.log(pin);
    const file = new FormData();
    file.append("file", pin.imageId);
    axios({
      method: "post",
      url: "me/uploadImage",
      data: file,
    })
      .then((response) => {
        pin.imageId = response.data.imageId;
        axios.post("me/pins", pin).then((response) => {
          state.pin = response.data
          console.log(state.pin)
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
