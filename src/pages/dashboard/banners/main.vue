<template>
  <q-page class="banners-page">
    <MainBanners />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MainBanners from 'src/components/dashboard/banners/main.vue';

export default defineComponent({
  name: 'MainBannersPage',
  components: {
    MainBanners
  }
})
</script>
