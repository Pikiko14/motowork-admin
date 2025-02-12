/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from "vue";
import { defineStore } from "pinia";
import { Request } from "src/api/api";
import { ResponseObj } from "src/interfaces/api";
import { OrderInterface } from "@/interfaces/orders.interface";

const path = "orders";
const handlerRequest = new Request({
  Accept: "application/json",
});

export const useOrdersStore = defineStore("ordersStore", () => {
  const orders = ref<OrderInterface[]>([]);
  const totalItems = ref<number>(0);
  const totalPages = ref<number>(0);


  /**
   * Save category
   * @param { any } params params of creation
   * @returns
   */
  const listOrders = async (
    query: string
  ): Promise<ResponseObj | void> => {
    try {
      const response = (await handlerRequest.doGetRequest(
        `${path}`,
        query,
        true,
      )) as ResponseObj;
      if (response.success) {
        orders.value = response.data.orders

        // up total items
        totalItems.value = response.data.totalItems
        totalPages.value = response.data.totalPages

        // return response
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clearOrders  = () => {
    orders.value = []
    totalItems.value = 0
    totalPages.value = 0
  }

  // return statement
  return {
    orders,
    totalItems,
    totalPages,
    listOrders,
    clearOrders,
  };
});
