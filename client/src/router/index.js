/* eslint-disable */
import Vue from "vue";
import Router from "vue-router";

import store from "../store";

// Dashboard Components
import dashboard from "../views/dashboard";

//  Widgets Components
import mainView from "../mainView";

import buttons from "../views/basic-elements/buttons";

import errorPage from "../views/404Page";
import login from "../views/samples/user-pages/login";

//POS
import MainPOSVIEW from "../views/admin/POS/MainPOSView";
// admin
import adminProfile from "../views/admin/profile.admin";
import usersList from "@/views/admin/usersList";
import addUser from "../views/admin/addUser";
import userinfo from "@/components/admin/manageUser/user.profile";
import editProfile from "@/views/admin/editProfile";
import CategoriesView from "@/views/admin/manageProdView/CategoriesView";
import productTabsView from "@/views/admin/manageProdView/productsTabsView";
import receivingOrderView from "@/views/admin/inventory/ReceivingOrder";
import distCustView from "../views/admin/Customer/CustomerView";

// user
import userProfile from "../views/user/userProfile";

// supervisor
// import supervisorProfile from '../views/supervisor/supervisorProfile'

Vue.use(Router);

const router = new Router({
  linkActiveClass: "active",
  scrollBehavior: () => ({ y: 0 }),
  mode: "hash",
  routes: [
    {
      //para sa admin
      path: "/",
      redirect: "/dashboard",
      component: mainView,
      children: [
        {
          path: "/POS",
          name: "mainViewPOS",
          component: MainPOSVIEW
        },
        {
          path: "/dashboard",
          name: "dashboard",
          component: dashboard,
          meta: {
            requiresAuth: true,
            requiresOnlyAdmin: true
          }
        },
        {
          path: "/usersList",
          name: "usersList",
          component: usersList,
          meta: {
            requiresAuth: true,
            requiresOnlyAdmin: true
          }
        },
        {
          path: "/addUser",
          name: "addUser",
          component: addUser,
          meta: {
            requiresAuth: true,
            requiresOnlyAdmin: true
          }
        },
        {
          path: "/editProfile",
          name: "editProfile",
          component: editProfile,
          meta: {
            requiresAuth: true,
            requiresOnlyAdmin: true
          }
        },
        {
          path: "/newUserInfo/:id",
          name: "newUserInfo",
          component: userinfo,
          meta: {
            requiresAuth: true,
            requiresOnlyAdmin: true
          }
        },
        {
          path: "/profile",
          name: "profile",
          component: adminProfile,
          meta: {
            requiresAuth: true,
            requiresOnlyAdmin: true
          }
        },
        {
          path: "/Customer",
          name: "distCustView  ",
          component: distCustView,
          meta: {
            requiresAuth: true,
            requiresOnlyAdmin: true
          }
        },
        {
          path: "/categories",
          name: "CategoriesView",
          component: CategoriesView,
          meta: {
            requiresAuth: true,
            requiresOnlyAdmin: true
          }
        },
        {
          path: "/ManageRecords",
          name: "productTabsView",
          component: productTabsView,
          meta: {
            requiresAuth: true,
            requiresOnlyAdmin: true
          }
        },
        {
          path: "/ReceivingOrders",
          name: "receivingOrderView",
          component: receivingOrderView,
          meta: {
            requiresAuth: true,
            requiresOnlyAdmin: true
          }
        },
        {
          path: "/errorPage",
          name: "404Page",
          component: errorPage
        }
      ]
    },
    {
      //para sa supervisor
      path: "/SV",
      redirect: "/userProfile",
      component: mainView,
      meta: {
        requiresAuth: true,
        requiresSV: true
      },
      children: [
        {
          name: "SVProfile",
          path: "/userProfile",
          component: adminProfile
        }
      ]
    },
    {
      //para sa user
      path: "/user",
      redirect: "/userProfile",
      component: mainView,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          name: "userProfile",
          path: "/userProfile",
          component: adminProfile
        }
      ]
    },
    {
      path: "*",
      redirect: "/errorPage"
    }
  ]
});

router.beforeEach((to, from, next) => {
  const role = localStorage.getItem("role");
  const admin = "admin";
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      return next("/pages/login");
    }
    if (to.matched.some(record => record.meta.requiresOnlyAdmin)) {
      if (role !== admin) {
        return next("pages/login");
      } else {
        return next();
      }
    }
    if (to.matched.some(record => record.meta.requiresSV)) {
      if (role === "supervisor") {
        return next();
      } else {
        return next("pages/login");
      }
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
