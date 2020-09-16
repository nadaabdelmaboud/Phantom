import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueLazyload from "vue-lazyload";
import "./registerServiceWorker";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

Vue.config.productionTip = false;

//axios.defaults.baseURL = "https://phantomrequiemserver.herokuapp.com/api";
axios.defaults.baseURL = "http://localhost:3000/api";

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

Vue.use(VueLazyload);
