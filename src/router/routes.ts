import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("src/layouts/mainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("src/pages/loginPage.vue"),
        name: "loginAuth",
      },
    ],
    name: "login",
  },
  {
    path: "/dashboard",
    component: () => import("src/layouts/mainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("src/pages/dashboard/main.vue"),
        meta: {
          auth: true,
        },
        name: "dashboard",
      },
      {
        path: "banners",
        component: () => import("src/pages/dashboard/banners/main.vue"),
        meta: {
          available: ["list-banners"],
          auth: true,
        },
        name: "banners",
      },
      {
        path: "categories",
        component: () => import("src/pages/dashboard/categories/main.vue"),
        meta: {
          available: ["list-category"],
          auth: true,
        },
        name: "categories",
      },
      {
        path: "brands",
        component: () => import("src/pages/dashboard/brands/main.vue"),
        meta: {
          available: ["list-brand"],
          auth: true,
        },
        name: "brands",
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("src/pages/errorNotFound.vue"),
  },
];

export default routes;
