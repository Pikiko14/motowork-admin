<template>
  <q-page class="banners-page">
    <MainCategories />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MainCategories from 'src/components/dashboard/categories/main.vue';

export default defineComponent({
  name: 'CategoriesPage',
  components: {
    MainCategories
  }
})
</script>
