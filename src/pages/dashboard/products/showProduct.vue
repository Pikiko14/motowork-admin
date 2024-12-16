<template>
    <q-page class="banners-page">
      <ShowProducts />
    </q-page>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue'
  import ShowProducts from 'src/components/dashboard/products/showProduct.vue';
  
  export default defineComponent({
    name: 'ShowProductPage',
    components: {
        ShowProducts
    }
  })
  </script>