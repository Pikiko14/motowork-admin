/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from "vue";
import { defineStore } from "pinia";
import { Request } from "src/api/api";
import { Utils } from "src/utils/utils";
import { ResponseObj } from "src/interfaces/api";
import { BlogsInterface } from "./../interfaces/blogs.interface";

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
  const doSaveBlogs = async (params: FormData): Promise<ResponseObj | void> => {
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

  const doListBlogs = async (query: string) => {
    try {
      const response = (await handlerRequest.doGetRequest(
        `${path}`,
        query,
        true
      )) as ResponseObj;
      if (response.success) {
        blogs.value = response.data.brands;
        totalItems.value = response.data.totalItems;
        totalPages.value = response.data.totalPages;
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const doFilterBlog = async (id: string) => {
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

  // return statement
  return {
    blogs,
    totalItems,
    totalPages,
    clearBlogs,
    doSaveBlogs,
    doListBlogs,
    doFilterBlog,
    doUploadFiles,
  };
});
