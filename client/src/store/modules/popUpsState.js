const state = {
  welcomePopUp: false,
  genderPopUp: false,
  countryPopUp: false,
  createBoardPopup:false
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
  }
};
export default {
  namespaced: true,
  state,
  mutations
};
