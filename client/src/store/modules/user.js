import axios from "axios";
const state = {
  signUpState: null,
  validPasswordLength: null,
  containCapitalChar: null,
  containSpecialChar: null,
  containNumber: null,
  validPassword: null,
  errorMessage: null,
  emailConfirm: false,
  loginState: null,
  updateStatus: null,
  sendEmailStatus: null,
  resetPasswordStatus: null,
  userData: null,
  isLoading: false,
  imgID: null
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
  },
  setSendEmail(state, status) {
    state.sendEmailStatus = status;
  },
  setResetStatus(state, status) {
    state.resetPasswordStatus = status;
  },
  setUserData(state, payload) {
    state.userData = payload;
    state.isLoading = false;
  },
  setLoading() {
    state.isLoading = true;
  },
  setUpdateStatus(state, payload) {
    state.updateStatus = payload;
  },
  changeImgID(state, payload) {
    state.imgID = payload;
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
  confirmEmail({ commit, dispatch }, token) {
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
        dispatch("getUserProfile");
      })
      .catch(error => {
        commit("setEmailConfirm", false);
        console.log("axios caught an error");
        console.log(error);
      });
  },
  login({ commit, dispatch }, data) {
    axios
      .post("login/", data)
      .then(response => {
        let token = response.data.token;
        localStorage.setItem("userToken", token);
        commit("setLogin", true);
        dispatch("notifications/notifyUser", null, { root: true });
      })
      .catch(error => {
        commit("setLogin", false);
        console.log(error);
        if (error.response.data.message == "password is not correct")
          commit("setErrorMessage", "Password is not correct");
        else commit("setErrorMessage", "Email is not correct");
      });
  },
  forgetPassword({ commit }, emailAddress) {
    axios
      .post("/forget-password", { email: emailAddress })
      .then(() => {
        commit("setSendEmail", true);
      })
      .catch(error => {
        commit("setSendEmail", false);
        if (error.response.data.message == "not user by this email")
          commit("setErrorMessage", "This Email is not correct");
      });
  },
  resetPassword({ commit }, payload) {
    axios
      .put(
        "/me/reset-password?newPassword=" +
          payload.newPassword +
          "&oldPassword=" +
          payload.oldPassword,
        {},
        {
          headers: {
            Authorization: payload.token
          }
        }
      )
      .then(() => {
        commit("setResetStatus", true);
      })
      .catch(error => {
        console.log(error);
      });
  },
  async getUserProfile({ commit }) {
    commit("setLoading");
    await axios
      .get("users/me", {
        headers: {
          Authorization: localStorage.getItem("userToken")
        }
      })
      .then(response => {
        commit("setUserData", response.data);
      })
      .catch(error => {
        console.log("axios caught an error");
        console.log(error);
      });
  },
  updateUserInfo({ commit }, payload) {
    axios
      .put("/me/update", payload, {
        headers: {
          Authorization: localStorage.getItem("userToken")
        }
      })
      .then(response => {
        commit("setUpdateStatus", true);
        commit("setUserData", response.data);
      })
      .catch(error => {
        console.log(error);
      });
  },
  async uploadImg({ commit }, img) {
    console.log(img);
    await axios({
      method: "post",
      url: "me/uploadImage",
      data: img
    })
      .then(response => {
        commit("changeImgID", response.data[0].id);
      })
      .catch(error => {
        console.log(error);
      });
  },
  async changeProfilePic({ state, commit, dispatch }, imgFile) {
    await dispatch("uploadImg", imgFile).then(async () => {
      await dispatch("updateUserInfo", { profileImage: state.imgID }).then(
        () => {
          localStorage.setItem("imgProfileID", state.imgID);
          commit("popUpsState/toggleChangePhotoPopUp", null, { root: true });
        }
      );
    });
  },
  updateUserSettings({ commit }, payload) {
    axios
      .put("/me/update-settings", payload, {
        headers: {
          Authorization: localStorage.getItem("userToken")
        }
      })
      .then(response => {
        commit("setUserData", response.data);
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
