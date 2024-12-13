<template>
  <q-page class="banners-page">
    <MainProducts />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MainProducts from 'src/components/dashboard/products/mainProducts.vue';

export default defineComponent({
  name: 'ProductsPage',
  components: {
    MainProducts
  }
})
</script>