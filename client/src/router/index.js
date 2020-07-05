import Vue from "vue";
import VueRouter from "vue-router";
import SignUp from "../views/SignUp.vue";
import PhantomHome from "../views/PhantomHome.vue";
import UserHome from "../views/UserHome.vue";
import Following from "../views/Following.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "",
    name: "PhantomHome",
    component: PhantomHome,
    children: [
      {
        path: "",
        name: "UserHome",
        component: UserHome
      },
      {
        path: "Following",
        name: "Following",
        component: Following
      }
    ]
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
