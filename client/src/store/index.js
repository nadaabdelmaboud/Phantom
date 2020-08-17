import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user.js";
import popUpsState from "./modules/popUpsState.js";
import pins from "./modules/pins.js";
import boards from "./modules/boards.js";
import homeCards from "./modules/homeCards.js";
import followers from "./modules/followers.js";
import phantomUser from "./modules/phantomUser.js";
import postPage from "./modules/postPage.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    popUpsState,
    pins,
    boards,
    phantomUser,
    homeCards,
    followers,
    postPage
  }
});
