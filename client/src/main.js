import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import VueLazyload from "vue-lazyload";
import "./registerServiceWorker";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import VueMasonry from "vue-masonry-css";

Vue.use(VueMasonry);
Vue.config.productionTip = process.env.VUE_APP_productionTip;
Vue.prototype.$url = process.env.VUE_APP_baseURL;
Vue.prototype.$frontUrl = process.env.VUE_APP_frontbaseURL;
axios.defaults.baseURL = process.env.VUE_APP_baseURL;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

Vue.use(VueLazyload);
