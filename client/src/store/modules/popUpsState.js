const state = {
  welcomePopUp: false,
  genderPopUp: false,
  countryPopUp: false
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
  }
};
export default {
  namespaced: true,
  state,
  mutations
};
