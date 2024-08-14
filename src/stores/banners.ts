/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from "vue";
import { defineStore } from "pinia";
import { Request } from "src/api/api";
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
            banner.desktop_image = banner.images.find(
              (item: BannerImageInterface) => {
                return item.type === TypeImageBanner.desktop;
              }
            );
            return banner;
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

  const doSaveBanners = async (params: any) => {
    try {
      const response = (await handlerRequest.doPostRequest(
        `${path}`,
        params,
        true,
        true
      )) as ResponseObj;
      if (response.success) {
        response.data.desktop_image = response.data.images.find(
          (item: BannerImageInterface) => {
            return item.type === TypeImageBanner.desktop;
          }
        );
        banners.value.push(response.data);
        totalItems.value++;
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // return statement
  return {
    banners,
    totalPages,
    listBanners,
    doSaveBanners,
  };
});
