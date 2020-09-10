const state = {
  welcomePopUp: false,
  genderPopUp: false,
  countryPopUp: false,
  createBoardPopup: false,
  newPinPopup: false,
  editBoardPopup: false,
  CollaboratorsPopup: false,
  TopicsPopup: false,
  changePasswordPopUp: false,
  forgetPasswordPopUp: false,
  addSection:false,
  changePhotoPopUp: false,
  leavingPopUp: false,
  accountClosingPopup: false,
  reportPinPopUp: false
};

const mutations = {
  toggleWelcomeState(state) {
    state.welcomePopUp = !state.welcomePopUp;
  },
  toggleGenderPopUp(state) {
    state.genderPopUp = !state.genderPopUp;
  },
  toggleCountryPopUp(state) {
    state.countryPopUp = !state.countryPopUp;
  },
  toggleCreateBoardPopup(state) {
    state.createBoardPopup = !state.createBoardPopup;
  },
  toggleNewPin(state) {
    state.newPinPopup = !state.newPinPopup;
  },
  toggleEditBoardPopup(state) {
    state.editBoardPopup = !state.editBoardPopup;
  },
  toggleCollaboratorsPopup(state) {
    state.CollaboratorsPopup = !state.CollaboratorsPopup;
  },
  toggleTopicsPopup(state) {
    state.TopicsPopup = !state.TopicsPopup;
  },
  toggleChangePasswordPopUp(state) {
    state.changePasswordPopUp = !state.changePasswordPopUp;
  },
  toggleForgetPasswordPopUp(state) {
    state.forgetPasswordPopUp = !state.forgetPasswordPopUp;
  },
  toggleAddSection(state) {
    state.addSection = !state.addSection;
  },
  toggleChangePhotoPopUp(state) {
    state.changePhotoPopUp = !state.changePhotoPopUp;
  },
  toggleLeavingPopUp(state) {
    state.leavingPopUp = !state.leavingPopUp;
  },
  toggleAccountClosingPopup(state) {
    state.accountClosingPopup = !state.accountClosingPopup;
  },
  toggleReportPinPopUp(state) {
    state.reportPinPopUp = !state.reportPinPopUp;
  }
};
export default {
  namespaced: true,
  state,
  mutations
};
