/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from "vue";
import { defineStore } from "pinia";
import { Request } from "src/api/api";
import { Utils } from "src/utils/utils";
import { ResponseObj } from "src/interfaces/api";
import { ProductsInterface } from "@/interfaces/productsInterface";

const path = "products";
const handlerRequest = new Request({
  Accept: "application/json",
});

export const useProductsStore = defineStore("productsStore", () => {
  // references
  const totalItems = ref<number>(0);
  const totalPages = ref<number>(0);
  const utils = new Utils("brand");
  const products = ref<ProductsInterface[]>([]);

  // methods

  /**
   * Save products
   * @param { ProductsInterface } params params of creation
   * @returns
   */
  const doSaveProduct = async (
    params: FormData
  ): Promise<ResponseObj | void> => {
    try {
      const response = (await handlerRequest.doPostRequest(
        `${path}`,
        params,
        true,
        false
      )) as ResponseObj;
      if (response.success) {
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // return statement
  return {
    products,
    totalItems,
    doSaveProduct,
  };
});
