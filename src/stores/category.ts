/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from "vue";
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
  const doSaveCategories = async (
    params: FormData
  ): Promise<ResponseObj | void> => {
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
        const type = queryParams.type ? (queryParams.type as string) : "";
        if (categories.value.length < perPage && type === response.data.type)
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

  const doListCategories = async (query: string) => {
    try {
      const response = (await handlerRequest.doGetRequest(
        `${path}`,
        query,
        true
      )) as ResponseObj;
      if (response.success) {
        categories.value = response.data.categories;
        totalItems.value = response.data.totalItems;
        totalPages.value = response.data.totalPages;
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getById = (id: string): CategoriesInterface | void => {
    try {
      const category = categories.value.find((item) => item._id === id);
      return category;
    } catch (error) {
      console.log(error);
    }
  };

  const doDeleteCategory = async (id: string): Promise<ResponseObj | void> => {
    try {
      const response = await handlerRequest.doDeleteRequest(
        `${path}/${id}`,
        true
      );
      if (response.success) {
        const queryParams = utils.getCurrentQueryParams();
        const perPage = queryParams.perPage || 7;

        // delete from store
        const index = categories.value.findIndex(
          (category: CategoriesInterface) => category._id === id
        );
        if (index !== -1) categories.value.splice(index, 1);

        // up total items
        totalItems.value--;

        // set total pages
        totalPages.value = Math.ceil(totalItems.value / perPage);
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const doUpdateCategories = async (
    id: string | undefined,
    params: any
  ): Promise<ResponseObj | void> => {
    try {
      const response = await handlerRequest.doPutRequest(
        `${path}/${id}`,
        params,
        true,
        true
      );
      if (response.success) {
        const index = categories.value.findIndex(
          (category: CategoriesInterface) => category._id === id
        );
        if (index !== -1) categories.value[index] = response.data;
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const doChangeStatus = async (id: string): Promise<ResponseObj | void> => {
    try {
      const response = await handlerRequest.doPutRequest(
        `${path}/${id}/change-status`,
        {},
        true,
        true
      );
      if (response.success) {
        const index = categories.value.findIndex(
          (category: CategoriesInterface) => category._id === id
        );
        if (index !== -1) categories.value[index] = response.data;
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // return statement
  return {
    getById,
    categories,
    totalItems,
    totalPages,
    doChangeStatus,
    doDeleteCategory,
    doSaveCategories,
    doListCategories,
    doUpdateCategories,
  };
});
