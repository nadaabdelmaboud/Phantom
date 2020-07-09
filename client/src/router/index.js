import Vue from "vue";
import VueRouter from "vue-router";
import SignUp from "../views/SignUp.vue";
import PhantomHome from "../views/PhantomHome.vue";
import UserHome from "../views/UserHome.vue";
import Following from "../views/Following.vue";
import PostPage from "../views/PostPage.vue";
import WelcomePage from "../views/SignUpPopUps/WelcomePage.vue";
import LoginView from "../views/LoginView.vue";

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
      },
      {
        path: "PostPage",
        name: "PostPage",
        component: PostPage
      }
    ]
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView
  },
  {
    path: "/confirm",
    name: "confirm",
    query: "token=",
    component: WelcomePage
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
