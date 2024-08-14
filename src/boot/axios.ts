/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable semi */
import { boot } from "quasar/wrappers";
import axios, { AxiosInstance } from "axios";
import { notification } from "./notification";
import { useAuthStore } from "src/stores/auth";
import { StorageService } from "src/utils/storage";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const api = axios.create({ baseURL: `${process.env.API_URL}/api/v1` });

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
  app.config.globalProperties.$urlApi = process.env.API_URL;

  const storage = new StorageService("interceptor");
  const store = useAuthStore();

  // prepare interceptor axios
  api.interceptors.response.use(undefined, async (error: any) => {
    if (error.response?.status === 401) {
      storage.deleteItemStorage("local", "user");
      storage.deleteItemStorage("local", "session");
      store.doLogout();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
    if (error.response) {
      if (error.response.status === 422) {
        if (error) {
          const { data } = error.response.data;
          const { msg } = data.shift();
          notification("negative", msg, "red");
        }
      } else {
        error.response.data.message
          ? notification("negative", error.response.data.message, "red")
          : error.response.data.error
          ? notification("negative", error.response.data.error, "red")
          : notification("negative", error.response.statusText, "red");
      }
    } else {
      notification(
        "negative",
        error.message
          ? error.message
          : "Algo ha ocurrio al intentar procesar esta solicitud",
        "red"
      );
    }

    // return promise
    return Promise.reject(error);
  });
});

export { api };
