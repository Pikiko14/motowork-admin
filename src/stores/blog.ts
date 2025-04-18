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

  const doDeleteBlog = async (id: string): Promise<ResponseObj | void> => {
    try {
      const response = await handlerRequest.doDeleteRequest(
        `${path}/${id}`,
        true
      );
      if (response.success) {
        const queryParams = utils.getCurrentQueryParams();
        const perPage = queryParams.perPage || 8;

        // delete from store
        const index = blogs.value.findIndex(
          (blog: BlogsInterface) => blog._id === id
        );
        if (index !== -1) blogs.value.splice(index, 1);

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

  const doUpdateBlog = async (
      params: BlogsInterface,
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

  // delete image
  const deleteImage = async (id: string, imageId: string) => {
    try {
      const response = await handlerRequest.doDeleteRequest(
        `${path}/${id}/delete-image?imageId=${imageId}`,
        true
      );
      return response;
    } catch (error) {
      throw error
    }
  };

  // return statement
  return {
    blogs,
    totalItems,
    totalPages,
    clearBlogs,
    deleteImage,
    doSaveBlogs,
    doListBlogs,
    doUpdateBlog,
    doFilterBlog,
    doDeleteBlog,
    doUploadFiles,
  };
});
