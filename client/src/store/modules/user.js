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
  errorMessage: null,
  emailConfirm: false,
  loginState: null
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
  },
  setEmailConfirm(state, status) {
    state.emailConfirm = status;
  },
  setLogin(state, status) {
    state.loginState = status;
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
  },
  confirmEmail({ commit }, token) {
    axios
      .post(
        "sign_up/confirm",
        {},
        {
          headers: {
            Authorization: `${token}`
          }
        }
      )
      .then(response => {
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("imgProfileID", response.data.profileImage);
        commit("setEmailConfirm", true);
        console.log(response.data.token);
      })
      .catch(error => {
        commit("setEmailConfirm", false);
        console.log("axios caught an error");
        console.log(error);
      });
  },
  login({ commit }, data) {
    axios
      .post("login", data)
      .then(response => {
        localStorage.setItem("userToken", response.data.token);
        commit("setLogin", true);
      })
      .catch(error => {
        commit("setLogin", false);
        console.log(error.response);
        if (error.response.data.error == " password is not correct")
          commit("setErrorMessage", "Password is not correct");
        else commit("setErrorMessage", "Email is not correct");
      });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
