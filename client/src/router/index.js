import Vue from "vue";
import VueRouter from "vue-router";
import SignUp from "../views/Auth/SignUp.vue";
import PhantomHome from "../views/PhantomHome.vue";
import UserHome from "../views/UserHome.vue";
import Following from "../views/Following.vue";
import PinBuilder from "../views/PinBuilder.vue";
import PostPage from "../views/PostPage.vue";
import WelcomePage from "../views/SignUpPopUps/WelcomePage.vue";
import LoginView from "../views/Auth/LoginView.vue";
import UserProfile from "../views/UserProfile";
import UserBoards from "../views/UserBoards";
import UserPins from "../views/UserPins";
import EditProfile from "../views/EditProfile";
import EditProfileSettings from "../components/UserSettings/EditProfileSettings";
import AccountSettings from "../components/UserSettings/AccountSettings";
import NotificationsSettings from "../components/UserSettings/NotificationsSettings";
import EmailConfirm from "../views/SignUpPopUps/EmailConfirm";
import ForgetPassword from "../views/PasswordManagement/ForgetPassword.vue";
import ResetPassword from "../views/PasswordManagement/ResetPassword.vue";
import BoardView from "../views/BoardView.vue";
import BoardPins from "../components/BoardPins";
import BoardMoreLike from "../components/BoardMoreLike";
import TopicsPage from "../views/TopicsPage.vue";
import SectionView from "../views/SectionView";
import NotidicationBoards from "../components/Notification/NotificationBoards";
import NotidicationPins from "../components/Notification/NotificationPins";
import Search from "../views/Search.vue";
import SearchPins from "../components/Search/SearchPins";
import SearchMyPins from "../components/Search/SearchMyPins";
import SearchPeople from "../components/Search/SearchPeople";
import SearchBoards from "../components/Search/SearchBoards";
import GoogleAuth from "../views/Auth/AuthRedirect.vue";

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
        path: "/TopicsPage",
        name: "TopicsPage",
        component: TopicsPage
      },
      {
        path: "PinBuilder",
        name: "PinBuilder",
        component: PinBuilder
      },
      {
        path: "PostPage/:postPageId",
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
        path: "/User/:userId",
        name: "anotherUser",
        redirect: "/User/:userId/Boards",
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
        path: "Board/:boardId",
        name: "Board",
        component: BoardView,
        children: [
          {
            path: "Pins",
            name: "Pins",
            component: BoardPins
          },
          {
            path: "More",
            name: "More",
            component: BoardMoreLike
          }
        ]
      },
      {
        path: "Section/:boardId/:sectionId",
        name: "Section",
        component: SectionView
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
          }
        ]
      },
      {
        path: "BoardForYou",
        name: "BoardForYou",
        component: NotidicationBoards
      },
      {
        path: "PinsForYou",
        name: "PinsForYou",
        component: NotidicationPins
      },
      {
        path: "/search",
        name: "Search",
        component: Search,
        redirect: "/search/allpins/:name",
        children: [
          {
            path: "/search/allpins/:name",
            name: "SearchPins",
            component: SearchPins
          },
          {
            path: "/search/mypins/:name",
            name: "SearchMyPins",
            component: SearchMyPins
          },
          {
            path: "/search/people/:name",
            name: "SearchPeople",
            component: SearchPeople
          },
          {
            path: "/search/boards/:name",
            name: "SearchBoards",
            component: SearchBoards
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
  },
  {
    path: "/aouth/google",
    name: "Auth",
    props: route => ({
      token: route.query.token,
      type: route.query.type
    }),
    component: GoogleAuth
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
