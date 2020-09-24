import Vue from "vue";
import VueRouter from "vue-router";
import SignUp from "../views/Auth/SignUp.vue";
import PhantomHome from "../views/PhantomHome.vue";
import UserHome from "../views/UserHome.vue";
import Following from "../views/Following.vue";
import PinBuilder from "../views/PinBuilder.vue";
import PostPage from "../views/PostPage.vue";
import WelcomePage from "../views//EmailManagement/WelcomePage.vue";
import LoginView from "../views/Auth/LoginView.vue";
import UserProfile from "../views/UserProfile";
import UserBoards from "../views/UserBoards";
import UserPins from "../views/UserPins";
import EditProfile from "../views/EditProfile";
import EditProfileSettings from "../components/UserSettings/EditProfileSettings";
import AccountSettings from "../components/UserSettings/AccountSettings";
import NotificationsSettings from "../components/UserSettings/NotificationsSettings";
import EmailConfirm from "../views/EmailManagement/EmailConfirm";
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
import CurrentEmailConfirm from "../views/EmailManagement/ConfirmCurrentEmail";

import isLoggedIn from "@/mixins/isLoggedIn";

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
        component: UserHome,
        meta: {
          allowAnonymous: true
        }
      },
      {
        path: "Following",
        name: "Following",
        component: Following,
        meta: {
          allowAnonymous: false
        }
      },
      {
        path: "/TopicsPage",
        name: "TopicsPage",
        component: TopicsPage,
        meta: {
          allowAnonymous: false
        }
      },
      {
        path: "PinBuilder",
        name: "PinBuilder",
        component: PinBuilder,
        meta: {
          allowAnonymous: false
        }
      },
      {
        path: "PostPage/:postPageId",
        name: "PostPage",
        component: PostPage,
        meta: {
          allowAnonymous: false
        }
      },
      {
        path: "/UserProfile",
        name: "UserProfile",
        component: UserProfile,
        children: [
          {
            path: "Boards",
            name: "Boards",
            component: UserBoards,
            meta: {
              allowAnonymous: false
            }
          },
          {
            path: "Pins",
            name: "Pins",
            component: UserPins,
            meta: {
              allowAnonymous: false
            }
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
            component: UserBoards,
            meta: {
              allowAnonymous: false
            }
          },
          {
            path: "Pins",
            name: "Pins",
            component: UserPins,
            meta: {
              allowAnonymous: false
            }
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
            component: BoardPins,
            meta: {
              allowAnonymous: false
            }
          },
          {
            path: "More",
            name: "More",
            component: BoardMoreLike,
            meta: {
              allowAnonymous: false
            }
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
            component: EditProfileSettings,
            meta: {
              allowAnonymous: false
            }
          },
          {
            path: "/settings/account-settings",
            name: "AccountSettings",
            component: AccountSettings,
            meta: {
              allowAnonymous: false
            }
          },
          {
            path: "/settings/notifications",
            name: "Notifications",
            component: NotificationsSettings,
            meta: {
              allowAnonymous: false
            }
          }
        ]
      },
      {
        path: "BoardForYou",
        name: "BoardForYou",
        component: NotidicationBoards,
        meta: {
          allowAnonymous: false
        }
      },
      {
        path: "PinsForYou",
        name: "PinsForYou",
        component: NotidicationPins,
        meta: {
          allowAnonymous: false
        }
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
            component: SearchPins,
            meta: {
              allowAnonymous: false
            }
          },
          {
            path: "/search/mypins/:name",
            name: "SearchMyPins",
            component: SearchMyPins,
            meta: {
              allowAnonymous: false
            }
          },
          {
            path: "/search/people/:name",
            name: "SearchPeople",
            component: SearchPeople,
            meta: {
              allowAnonymous: false
            }
          },
          {
            path: "/search/boards/:name",
            name: "SearchBoards",
            component: SearchBoards,
            meta: {
              allowAnonymous: false
            }
          }
        ]
      }
    ]
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
    meta: {
      allowAnonymous: true
    }
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: {
      allowAnonymous: true
    }
  },
  {
    path: "/confirm",
    name: "confirm",
    query: "token=",
    component: WelcomePage,
    meta: {
      allowAnonymous: true
    }
  },
  {
    path: "/reset_password",
    name: "Reset Password",
    query: "token=",
    component: ResetPassword,
    meta: {
      allowAnonymous: true
    }
  },
  {
    path: "/email-confirm",
    name: "EmailConfirm",
    component: EmailConfirm,
    meta: {
      allowAnonymous: true
    }
  },
  {
    path: "/password-reset",
    name: "ForgetPassword",
    component: ForgetPassword,
    meta: {
      allowAnonymous: true
    }
  },
  {
    path: "/aouth/google",
    name: "Auth",
    props: route => ({
      token: route.query.token,
      type: route.query.type
    }),
    component: GoogleAuth,
    meta: {
      allowAnonymous: true
    }
  },
  {
    path: "/changeEmail",
    name: "ConfirmEmail",
    component: CurrentEmailConfirm,
    props: route => ({
      token: route.query.token,
      type: route.query.type
    }),
    meta: {
      allowAnonymous: true
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.name == "Login" && isLoggedIn.methods.isLoggedIn()) {
    next({
      path: "/"
    });
  } else if (to.name == "SignUp" && isLoggedIn.methods.isLoggedIn()) {
    next({
      path: "/"
    });
  } else if (!to.meta.allowAnonymous && !isLoggedIn.methods.isLoggedIn()) {
    next({
      path: "/login"
    });
  } else {
    next();
  }
});
export default router;
