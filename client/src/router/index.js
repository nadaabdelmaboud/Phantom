import Vue from "vue";
import VueRouter from "vue-router";
import SignUp from "../views/SignUp.vue";
import PhantomHome from "../views/PhantomHome.vue";
import UserHome from "../views/UserHome.vue";
import Following from "../views/Following.vue";
import PinBuilder from "../views/PinBuilder.vue";
import PostPage from "../views/PostPage.vue";
import WelcomePage from "../views/SignUpPopUps/WelcomePage.vue";
import LoginView from "../views/LoginView.vue";
import UserProfile from "../views/UserProfile";
import UserBoards from "../views/UserBoards";
import UserPins from "../views/UserPins";
import EditProfile from "../views/EditProfile";
import EditProfileSettings from "../components/UserSettings/EditProfileSettings";
import AccountSettings from "../components/UserSettings/AccountSettings";
import NotificationsSettings from "../components/UserSettings/NotificationsSettings";
import PrivacySettings from "../components/UserSettings/PrivacySettings";
import EmailConfirm from "../views/SignUpPopUps/EmailConfirm";
import ForgetPassword from "../views/ForgetPassword.vue";
import ResetPassword from "../views/ResetPassword.vue";

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
        path: "PinBuilder",
        name: "PinBuilder",
        component: PinBuilder
      },
      {
        path: "PostPage",
        name: "PostPage",
        component: PostPage
      },
      {
        path: "/UserProfile",
        name: "UserProfile",
        component: UserProfile,
        children: [
          {
            path: "Boards",
            name: "Boards",
            component: UserBoards
          },
          {
            path: "Pins",
            name: "Pins",
            component: UserPins
          }
        ]
      },
      {
        path: "/settings",
        name: "Settings",
        redirect: "/settings/edit-profile",
        component: EditProfile,
        children: [
          {
            path: "/settings/edit-profile",
            name: "EditProfile",
            component: EditProfileSettings
          },
          {
            path: "/settings/account-settings",
            name: "AccountSettings",
            component: AccountSettings
          },
          {
            path: "/settings/notifications",
            name: "Notifications",
            component: NotificationsSettings
          },
          {
            path: "/settings/privacy",
            name: "Privacy",
            component: PrivacySettings
          }
        ]
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
  },
  {
    path: "/reset_password",
    name: "Reset Password",
    query: "token=",
    component: ResetPassword
  },
  {
    path: "/email-confirm",
    name: "EmailConfirm",
    component: EmailConfirm
  },
  {
    path: "/password-reset",
    name: "ForgetPassword",
    component: ForgetPassword
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
