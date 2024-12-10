/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from "vue";
import { defineStore } from "pinia";
import { Request } from "src/api/api";
import { Utils } from "src/utils/utils";
import { ResponseObj } from "src/interfaces/api";
import { BrandsInterface } from "src/interfaces/brands.interface";

const path = "brands";
const handlerRequest = new Request({
  Accept: "application/json",
});

export const useBrandsStore = defineStore("brandsStore", () => {
  //## data ##//
  const totalItems = ref<number>(0);
  const totalPages = ref<number>(0);
  const utils = new Utils("brand");
  const brands = ref<BrandsInterface[]>([]);

  //## methods##//
  /**
   * Save brand
   * @param { any } params params of creation
   * @returns
   */
  const doSaveBrands = async (
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
        if (brands.value.length < perPage && type === response.data.type)
          brands.value.push(response.data);

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

  const doListBrands = async (query: string) => {
    try {
      const response = (await handlerRequest.doGetRequest(
        `${path}`,
        query,
        true
      )) as ResponseObj;
      if (response.success) {
        brands.value = response.data.brands;
        totalItems.value = response.data.totalItems;
        totalPages.value = response.data.totalPages;
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getById = (id: string): BrandsInterface | void => {
    try {
      const brand = brands.value.find((item) => item._id === id);
      return brand;
    } catch (error) {
      console.log(error);
    }
  };

  const doDeleteBrand = async (id: string): Promise<ResponseObj | void> => {
    try {
      const response = await handlerRequest.doDeleteRequest(
        `${path}/${id}`,
        true
      );
      if (response.success) {
        const queryParams = utils.getCurrentQueryParams();
        const perPage = queryParams.perPage || 7;

        // delete from store
        const index = brands.value.findIndex(
          (brand: BrandsInterface) => brand._id === id
        );
        if (index !== -1) brands.value.splice(index, 1);

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

  const doUpdateBrands = async (
    id: string | undefined,
    params: FormData
  ): Promise<ResponseObj | void> => {
    try {
      const response = await handlerRequest.doPutRequest(
        `${path}/${id}`,
        params,
        true,
        true
      );
      if (response.success) {
        const type = params.get("type") || "product";
        const index = brands.value.findIndex(
          (brand: BrandsInterface) => brand._id === id
        );
        if (type && type !== brands.value[index].type) {
          brands.value.splice(index, 1);
        } else {
          if (index !== -1) brands.value[index] = response.data;
        }
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
        const index = brands.value.findIndex(
          (brand: BrandsInterface) => brand._id === id
        );
        if (index !== -1) brands.value[index] = response.data;
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clearBrands = () => {
    brands.value = [];
    totalItems.value = 0;
    totalPages.value = 0;
  };

  // return statement
  return {
    getById,
    brands,
    totalItems,
    totalPages,
    doChangeStatus,
    clearBrands,
    doDeleteBrand,
    doSaveBrands,
    doListBrands,
    doUpdateBrands,
  };
});
