const state = {
  welcomePopUp: false,
  genderPopUp: false,
  countryPopUp: false,
  createBoardPopup: false,
  newPinPopup: false,
<<<<<<< HEAD
  editBoardPopup: false
=======
  editBoardPopup:false,
  CollaboratorsPopup:false
>>>>>>> FE_Boards
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
<<<<<<< HEAD
    state.editBoardPopup = !state.editBoardPopup;
=======
    state.editBoardPopup= !state.editBoardPopup;
  },
  toggleCollaboratorsPopup(state){
    state.CollaboratorsPopup = !state.CollaboratorsPopup;
>>>>>>> FE_Boards
  }
};
export default {
  namespaced: true,
  state,
  mutations
};
