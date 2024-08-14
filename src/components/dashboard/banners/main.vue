<template>
  <div class="row q-py-md q-my-xs" :class="{ 'q-pr-md': $q.screen.gt.sm }">
    <!-- headers -->
    <div class="col-12">
      <HeadersMotowork @open-modal="openModal" :title="'Administrador banners'" />
    </div>
    <!-- end headers -->

    <!--Modal Banners-->
    <q-dialog v-model="openModalBanners"></q-dialog>
    <!--End Modal Banners-->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import HeadersMotowork from '../partials/headersMotowork.vue';

export default defineComponent({
  name: 'MainBannersComponents',
  components: {
    HeadersMotowork
  },
  setup() {
    // data
    const openModalBanners = ref<boolean>(false)

    // methods
    const openModal = () => {
      openModalBanners.value = !openModalBanners.value
    }

    return {
      openModal,
      openModalBanners
    }
  }
})
</script>
