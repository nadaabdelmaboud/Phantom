import axios from "axios";
const state = {
  //Flags for password validation
  validPasswordLength: null,
  containCapitalChar: null,
  containSpecialChar: null,
  containNumber: null,
  validPassword: null,
  //////////////////////////////
  //Requests Status
  status: null,
  errorMessage: null,
  isLoading: false,
  //////////////////////////////
  //User Data (Name,Gender,....)
  userData: null,
  ///////////////////////////////
  //User Uploaded Image ID
  imgID: null,
  ///////////////////////////////
  userKey: 0
};

const mutations = {
  //Status for requests (Pass - Fail)
  setStatus(state, payload) {
    state.status = payload;
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
  setUserData(state, payload) {
    state.userData = payload;
    state.isLoading = false;
  },
  setErrorMessage(state, message) {
    state.errorMessage = message;
  },
  setLoading() {
    state.isLoading = true;
  },
  changeImgID(state, payload) {
    state.imgID = payload;
  },
  setKey(state, payload) {
    state.userKey = payload;
  }
};

const actions = {
  signUp({ commit }, userData) {
    commit("setStatus", false);
    commit("setErrorMessage", null);
    axios
      .post("sign_up", userData)
      .then(() => {
        commit("setStatus", true);
        commit("setKey", 1);
      })
      .catch(error => {
        if (error.response.data.message == "Mail exists") {
          commit("setStatus", false);
          commit("setErrorMessage", "This email is already exists");
        } else commit("setErrorMessage", error.response.data.message);
      });
  },
  confirmEmail({ commit, dispatch }, token) {
    commit("setStatus", false);
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
      .then(async response => {
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("imgProfileID", response.data.profileImage);
        await dispatch("getUserProfile");
        commit("setStatus", true);
      })
      .catch(error => {
        commit("setStatus", false);
        console.log("axios caught an error");
        console.log(error);
      });
  },
  login({ commit, dispatch }, data) {
    commit("setStatus", false);
    axios
      .post("login/", data)
      .then(async response => {
        let token = response.data.token;
        localStorage.setItem("userToken", token);
        await dispatch("getUserProfile");
        commit("setStatus", true);
        commit("setKey", 1);
      })
      .catch(error => {
        commit("setStatus", false);
        console.log(error);
        if (error.response.data.message == "password is not correct")
          commit("setErrorMessage", "Password is not correct");
        else commit("setErrorMessage", "Email is not correct");
      });
  },
  forgetPassword({ commit }, emailAddress) {
    commit("setStatus", false);
    axios
      .post("/forget-password", { email: emailAddress })
      .then(() => {
        commit("setStatus", true);
      })
      .catch(error => {
        commit("setStatus", false);
        if (error.response.data.message == "not user by this email")
          commit("setErrorMessage", "This Email is not correct");
      });
  },
  resetPassword({ commit }, payload) {
    commit("setStatus", false);
    axios
      .put("/me/reset-password", payload, {
        headers: {
          Authorization: payload.token
        }
      })
      .then(() => {
        commit("setStatus", true);
      })
      .catch(error => {
        console.log(error);
      });
  },
  async getUserProfile({ commit }) {
    commit("setLoading");
    let token = localStorage.getItem("userToken");
    axios.defaults.headers.common["Authorization"] = token;
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
    commit("setStatus", false);
    axios
      .put("/me/update", payload, {
        headers: {
          Authorization: localStorage.getItem("userToken")
        }
      })
      .then(response => {
        commit("setStatus", true);
        commit("setUserData", response.data);
      })
      .catch(error => {
        console.log(error);
      });
  },
  async uploadImg({ commit }, img) {
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
  },
  confrimEmailUpdate({ commit }, payload) {
    axios
      .put(
        "/me/confirm-update-email?type=" + payload.type,
        {},
        {
          headers: {
            Authorization: payload.token
          }
        }
      )
      .then(() => {
        commit("setStatus", true);
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
