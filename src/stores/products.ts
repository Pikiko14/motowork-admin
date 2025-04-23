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
  const utils = new Utils("products");
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

  const doListProducts = async (query: string) => {
    try {
      const response = (await handlerRequest.doGetRequest(
        `${path}`,
        query,
        true
      )) as ResponseObj;
      if (response.success) {
        products.value = response.data.brands;
        totalItems.value = response.data.totalItems;
        totalPages.value = response.data.totalPages;
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clearProducts = () => {
    products.value = [];
    totalItems.value = 0;
    totalPages.value = 0;
  };

  const doUploadFiles = async (
    params: FormData
  ): Promise<ResponseObj | void> => {
    try {
      const response = (await handlerRequest.doPostRequest(
        `${path}/upload-files`,
        params,
        true,
        true
      )) as ResponseObj;
      if (response.success) {
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const doFilterProduct = async (id: string) => {
    try {
      const response = (await handlerRequest.doGetRequest(
        `${path}/`,
        id,
        true
      )) as ResponseObj;
      if (response.success) {
        return response.data;
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const doDeleteProduct = async (id: string): Promise<ResponseObj | void> => {
    try {
      const response = await handlerRequest.doDeleteRequest(
        `${path}/${id}`,
        true
      );
      if (response.success) {
        const queryParams = utils.getCurrentQueryParams();
        const perPage = queryParams.perPage || 10;

        // delete from store
        const index = products.value.findIndex(
          (brand: ProductsInterface) => brand._id === id
        );
        if (index !== -1) products.value.splice(index, 1);

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

  const doUpdateProduct = async (
    params: ProductsInterface,
  ): Promise<ResponseObj | void> => {
    try {
      const response = (await handlerRequest.doPutRequest(
        `${path}/${params._id}`,
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

  const doDeleteProductImage = async (id: string, imageId: string, type: string): Promise<ResponseObj | void> => {
    try {
      const response = await handlerRequest.doDeleteRequest(
        `${path}/${id}/delete-image?imageId=${imageId}&type=${type}`,
        true
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const loadCountProduct = async () => {
    try {
      const response = (await handlerRequest.doGetRequest(
        `${path}/count-products/get`,
        '',
        true
      )) as ResponseObj;
      if (response.success) {
        return response.data;
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  const loadPublishProducts = async (period = 'week') => {
    try {
      const response = (await handlerRequest.doGetRequest(
        `${path}/publish-products/count?period=${period}`,
        '',
        true
      )) as ResponseObj;
      if (response.success) {
        return response.data;
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // return statement
  return {
    products,
    totalItems,
    totalPages,
    clearProducts,
    doSaveProduct,
    doUploadFiles,
    doListProducts,
    doFilterProduct,
    doDeleteProduct,
    doUpdateProduct,
    loadCountProduct,
    loadPublishProducts,
    doDeleteProductImage,
  };
});
