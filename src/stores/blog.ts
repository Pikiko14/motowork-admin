/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from "vue";
import { defineStore } from "pinia";
import { Request } from "src/api/api";
import { Utils } from "src/utils/utils";
import { ResponseObj } from "src/interfaces/api";
import { BlogsInterface } from './../interfaces/blogs.interface';

const path = "blogs";
const handlerRequest = new Request({
  Accept: "application/json",
});

export const useBlogsStore = defineStore("blogsStore", () => {
  // references
  const totalItems = ref<number>(0);
  const totalPages = ref<number>(0);
  const utils = new Utils("blogs");
  const blogs = ref<BlogsInterface[]>([]);

  // methods

  /**
   * Save blogs
   * @param { BlogsInterface } params params of creation
   * @returns
   */
  const doSaveBlogs = async (
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

  const clearBlogs = () => {
    blogs.value = [];
    totalItems.value = 0;
    totalPages.value = 0;
  };

  // return statement
  return {
    blogs,
    totalItems,
    totalPages,
    clearBlogs,
    doSaveBlogs,
    doUploadFiles,
  };
});
