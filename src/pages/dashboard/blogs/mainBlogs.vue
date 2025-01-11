<template>
    <q-page class="banners-page">
      <MainBlogs />
    </q-page>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  import MainBlogs from 'src/components/dashboard/blogs/main.vue';
  
  export default defineComponent({
    name: 'BlogMainPage',
    components: {
      MainBlogs
    }
  })
  </script>