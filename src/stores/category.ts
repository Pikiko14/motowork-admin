/* eslint-disable @typescript-eslint/no-explicit-any */
import { onBeforeMount, ref } from "vue";
import { defineStore } from "pinia";
import { Request } from "src/api/api";
import { Utils } from "src/utils/utils";
import { ResponseObj } from "src/interfaces/api";
import { CategoriesInterface } from "src/interfaces/categories.interface";

const path = "categories";
const handlerRequest = new Request({
  Accept: "application/json",
});

export const useCategoriesStore = defineStore("categoriesStore", () => {
  //## data ##//
  const totalItems = ref<number>(0);
  const totalPages = ref<number>(0);
  const utils = new Utils("category");
  const categories = ref<CategoriesInterface[]>([]);

  //## methods##//
  /**
   * Save category
   * @param { any } params params of creation
   * @returns
   */
  const doSaveCategories = async (params: FormData): Promise<ResponseObj | void> => {
    try {
      const response = (await handlerRequest.doPostRequest(
        `${path}`,
        params,
        true,
        true
      )) as ResponseObj;
      if (response.success) {
        // get query params
        const queryParams = utils.getCurrentQueryParams();
        const perPage = queryParams.perPage || 7;

        // push new item to storage
        if (categories.value.length < perPage)
          categories.value.push(response.data);

        // up total items
        totalItems.value++;

        // set total pages
        totalPages.value = Math.ceil(totalItems.value / perPage);

        // return response
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // return statement
  return {
    categories,
    totalItems,
    totalPages,
    doSaveCategories,
  };
});
