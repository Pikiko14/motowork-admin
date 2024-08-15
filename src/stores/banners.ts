/* eslint-disable @typescript-eslint/no-explicit-any */
import { onBeforeMount, ref } from "vue";
import { defineStore } from "pinia";
import { Request } from "src/api/api";
import { Utils } from "src/utils/utils";
import { ResponseObj } from "src/interfaces/api";
import {
  BannerImageInterface,
  BannersInterface,
  TypeImageBanner,
} from "src/interfaces/bannersInterface";

const path = "banners";
const handlerRequest = new Request({
  Accept: "application/json",
});

export const useBannersStore = defineStore("bannersStore", () => {
  //## data ##//
  const totalItems = ref<number>(0);
  const totalPages = ref<number>(0);
  const utils = new Utils("banners");
  const banners = ref<BannersInterface[]>([]);

  //## methods##//
  /**
   * List
   * @param { string } query
   * @returns
   */
  const listBanners = async (query: string): Promise<ResponseObj | void> => {
    try {
      const response = (await handlerRequest.doGetRequest(
        `${path}`,
        query,
        true
      )) as ResponseObj;
      if (response.success) {
        banners.value = response.data.banners.map(
          (banner: BannersInterface) => {
            if (banner.images) {
              banner.desktop_image = banner.images.find(
                (item: BannerImageInterface) => {
                  return item.type === TypeImageBanner.desktop;
                }
              );
              return banner;
            }
          }
        );
        totalItems.value = response.data.totalItems;
        totalPages.value = response.data.totalPages;
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Save banners
   * @param { any } params params of creation
   * @returns
   */
  const doSaveBanners = async (params: any): Promise<ResponseObj | void> => {
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

        // set desktop_image
        response.data.desktop_image = response.data.images.find(
          (item: BannerImageInterface) => {
            return item.type === TypeImageBanner.desktop;
          }
        );

        // push new item to storage
        if (banners.value.length < perPage) banners.value.push(response.data);

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

  /**
   * Delete banners
   * @param { string } id id of banners
   * @returns
   */
  const doDeleteBanners = async (id: string): Promise<ResponseObj | void> => {
    try {
      const response = await handlerRequest.doDeleteRequest(
        `${path}/${id}`,
        true
      );
      if (response.success) {
        // get query params
        const queryParams = utils.getCurrentQueryParams();
        const perPage = queryParams.perPage || 7;

        // delete from store
        const index = banners.value.findIndex(
          (banner: BannersInterface) => banner._id === id
        );
        if (index !== -1) banners.value.splice(index, 1);

        // up total items
        totalItems.value--;

        // set total pages
        totalPages.value = Math.ceil(totalItems.value / perPage);

        // return response
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   *
   * @param { string } id id of banner
   * @returns
   */
  const getBannerById = (id: string): BannersInterface => {
    const banner: BannersInterface = banners.value.find(
      (banner: BannersInterface) => banner._id === id
    ) as BannersInterface;
    return banner;
  };

  /**
   * Update banners
   * @param { string } id id of banner
   * @param { any } params params of creation
   * @returns
   */
  const doUpdateBanners = async (
    id: string,
    params: any
  ): Promise<ResponseObj | void> => {
    try {
      const response = (await handlerRequest.doPutRequest(
        `${path}/${id}`,
        params,
        true,
        true
      )) as ResponseObj;
      if (response.success) {
        // get query params
        const queryParams = utils.getCurrentQueryParams();
        const perPage = queryParams.perPage || 7;

        // set desktop_image
        response.data.desktop_image = response.data.images.find(
          (item: BannerImageInterface) => {
            return item.type === TypeImageBanner.desktop;
          }
        );

        // push new item to storage
        const index = banners.value.findIndex(
          (banner: BannersInterface) => banner._id === response.data._id
        );
        if (index !== -1) banners.value[index] = response.data;

        // return response
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // return statement
  return {
    banners,
    totalItems,
    totalPages,
    listBanners,
    getBannerById,
    doSaveBanners,
    doUpdateBanners,
    doDeleteBanners,
  };
});
