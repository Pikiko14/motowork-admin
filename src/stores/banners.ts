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
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  // return statement
  return {
    banners,
    listBanners,
  };
});
