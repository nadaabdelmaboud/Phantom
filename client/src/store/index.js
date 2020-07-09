import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user.js";
import popUpsState from "./modules/popUpsState.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    popUpsState
  }
});
