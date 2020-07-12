import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { makeServer } from "./server";
import axios from "axios";
import "./registerServiceWorker";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// import "https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/p5.min.js";
// import "https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/addons/p5.dom.min.js";
// import "https://unpkg.com/ml5@latest/dist/ml5.min.js";


Vue.config.productionTip = false;
if (process.env.NODE_ENV !== "development") {
  makeServer();
}
// axios.defaults.baseURL = "/api";
axios.defaults.baseURL = "http://localhost:3000/api";

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
