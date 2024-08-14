import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/LoginPage.vue") },
    ],
    name: "login",
  },
  {
    path: "/dashboard",
    component: () => import("layouts/MainLayout.vue"),
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
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
