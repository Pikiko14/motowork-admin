/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from "vue";
import { defineStore } from "pinia";
import { Request } from "src/api/api";
import { ResponseObj } from "src/interfaces/api";
import { ServiceInterface } from "@/interfaces/services.interface";

const path = "services";
const handlerRequest = new Request({
  Accept: "application/json",
});

export const useServicesStore = defineStore("servicesStore", () => {
  // references
  const totalItems = ref<number>(0);
  const totalPages = ref<number>(0);
  const services = ref<ServiceInterface[]>([]);

  // methods
  const doLoadServices = async (query: string) => {
    try {
      const response = (await handlerRequest.doGetRequest(
        `${path}`,
        query,
        true
      )) as ResponseObj;
      if (response.success) {
        services.value = response.data.brands;
        totalItems.value = response.data.totalItems;
        totalPages.value = response.data.totalPages;
        return response;
      }
    } catch (error) {
      console.error(error);
    }
  };

  // return statement
  return {
    services,
    doLoadServices,
  };
});
