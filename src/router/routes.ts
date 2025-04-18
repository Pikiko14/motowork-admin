import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("src/layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("src/pages/LoginPage.vue"),
        name: "loginAuth",
      },
    ],
    name: "login",
  },
  {
    path: "/dashboard",
    component: () => import("src/layouts/MainLayout.vue"),
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
      {
        path: "products",
        component: () => import("src/pages/dashboard/products/mainProducts.vue"),
        meta: {
          available: ["list-products"],
          auth: true,
        },
        name: "products",
      },
      {
        path: "products/create",
        component: () => import("src/pages/dashboard/products/createProducts.vue"),
        meta: {
          available: ["create-products"],
          auth: true,
        },
        name: "createProduct",
      },
      {
        path: "products/:id",
        component: () => import("src/pages/dashboard/products/showProduct.vue"),
        meta: {
          available: ["list-products"],
          auth: true,
        },
        name: "productShow",
      },
      {
        path: "products/:id/edit",
        component: () => import("src/pages/dashboard/products/createProducts.vue"),
        meta: {
          available: ["create-products"],
          auth: true,
        },
        name: "updateProducts",
      },
      {
        path: "blogs",
        component: () => import("src/pages/dashboard/blogs/mainBlogs.vue"),
        meta: {
          available: ["list-blog"],
          auth: true,
        },
        name: "blogs",
      },
      {
        path: "blogs/create",
        component: () => import("src/pages/dashboard/blogs/createBlogs.vue"),
        meta: {
          available: ["create-blog"],
          auth: true,
        },
        name: "createBlogs",
      },
      {
        path: "blogs/:id",
        component: () => import("src/pages/dashboard/blogs/showBlogs.vue"),
        meta: {
          available: ["list-blog"],
          auth: true,
        },
        name: "blogShow",
      },
      {
        path: "blogs/:id/edit",
        component: () => import("src/pages/dashboard/blogs/createBlogs.vue"),
        meta: {
          available: ["create-blog"],
          auth: true,
        },
        name: "updateBlogs",
      },
      {
        path: "orders",
        component: () => import("src/pages/dashboard/orders/main.vue"),
        meta: {
          available: ["list-orders"],
          auth: true,
        },
        name: "orders",
      },
      {
        path: "services",
        component: () => import("src/pages/dashboard/services/MainServices.vue"),
        meta: {
          available: ["list-services"],
          auth: true,
        },
        name: "services",
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("src/pages/ErrorNotFound.vue"),
  },
];

export default routes;
