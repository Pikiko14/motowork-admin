<template>
  <div class="row q-py-md q-my-xs">
    <!-- headers -->
    <div class="col-12">
      <HeadersMotowork @open-modal="openModal" :title="'Administrador banners'" />
    </div>
    <!-- end headers -->

    <!--table Banners-->
    <TableMotowork :columns="bannersColums" class="q-mt-lg" />
    <!--End table Banners-->

    <!--Modal Banners-->
    <q-dialog v-model="openModalBanners"></q-dialog>
    <!--End Modal Banners-->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import TableMotowork from '../partials/tableMotowork.vue';
import HeadersMotowork from '../partials/headersMotowork.vue';
import { TableColumnsInterface } from 'src/interfaces/tableInterface';

export default defineComponent({
  name: 'MainBannersComponents',
  components: {
    HeadersMotowork,
    TableMotowork
  },
  setup() {
    // data
    const openModalBanners = ref<boolean>(false)
    const bannersColums = ref<TableColumnsInterface[]>([
      {
        name: 'location',
        label: 'Ubicación',
        field: 'location'
      },
      {
        name: 'link',
        label: 'Enlace directo',
        field: 'link'
      },
    ])

    // methods
    const openModal = () => {
      openModalBanners.value = !openModalBanners.value
    }

    return {
      openModal,
      bannersColums,
      openModalBanners
    }
  }
})
</script>
