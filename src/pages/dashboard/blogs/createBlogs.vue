<template>
    <q-page class="banners-page">
      <CreateBlogs />
    </q-page>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  import CreateBlogs from 'src/components/dashboard/blogs/createBlogs.vue';
  
  export default defineComponent({
    name: 'CreateBlogsPage',
    components: {
        CreateBlogs
    }
  })
  </script>