<template>
    <q-page class="banners-page">
      <ShowBlog />
    </q-page>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  import ShowBlog from 'src/components/dashboard/blogs/showBlog.vue';
  
  export default defineComponent({
    name: 'ShowProductPage',
    components: {
        ShowBlog
    }
  })
  </script>