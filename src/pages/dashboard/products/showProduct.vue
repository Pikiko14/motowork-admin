<template>
    <q-page class="banners-page">
      <CreateProducts />
    </q-page>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  import CreateProducts from 'src/components/dashboard/products/createProducts.vue';
  
  export default defineComponent({
    name: 'ShowProductPage',
    components: {
        CreateProducts
    }
  })
  </script>