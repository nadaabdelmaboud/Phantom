import axios from "axios";

const state = {
  signUpState: null,
  userToken: "",
  userFirstName: "",
  userLastName: "",
  userEmail: "",
  validPasswordLength: null,
  containCapitalChar: null,
  containSpecialChar: null,
  containNumber: null,
  validPassword: null,
  errorMessage: null
};

const mutations = {
  changeSignUpState(state, payload) {
    state.signUpState = payload;
  },
  validatePassword(state, password) {
    var upperCaseLetters = /[A-Z]/g;

    if (password.match(upperCaseLetters)) state.containCapitalChar = true;
    else state.containCapitalChar = false;

    var numbers = /[0-9]/g;
    if (password.match(numbers)) state.containNumber = true;
    else state.containNumber = false;

    if (password.length >= 8) state.validPasswordLength = true;
    else state.validPasswordLength = false;

    var specialChars = /[!@#$%^&*]/g;
    if (password.match(specialChars)) state.containSpecialChar = true;
    else state.containSpecialChar = false;

    if (
      state.containSpecialChar &&
      state.validPasswordLength &&
      state.containNumber &&
      state.containCapitalChar
    )
      state.validPassword = true;
    else state.validPassword = false;
  },
  setErrorMessage(state, message) {
    state.errorMessage = message;
  }
};

const actions = {
  signUp({ commit }, userData) {
    commit("setErrorMessage", null);
    axios
      .post("sign_up", userData)
      .then(() => {
        commit("changeSignUpState", true);
      })
      .catch(error => {
        if (error.response.data.message == "Mail exists") {
          commit("changeSignUpState", false);
          commit("setErrorMessage", "This email is already exists");
        } else commit("setErrorMessage", error.response.data.message);
      });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
