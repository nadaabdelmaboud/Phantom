import axios from "axios";

const state = {
  signUpState: false,
  userToken: "",
  userFirstName: "",
  userLastName: "",
  userEmail: ""
};

const mutations = {
  changeSignUpState(state, payload) {
    state.signUpState = payload;
  }
};

const actions = {
  signUp({ commit }, userData) {
    axios
      .post("sign_up", userData)
      .then(() => {
        commit("changeSignUpState", true);
      })
      .catch(error => {
        console.log("axios caught an error");
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
