<template>
  <q-page class="banners-page">
    <MainBrands />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MainBrands from 'src/components/dashboard/brands/main.vue';

export default defineComponent({
  name: 'CategoriesPage',
  components: {
    MainBrands
  }
})
</script>
