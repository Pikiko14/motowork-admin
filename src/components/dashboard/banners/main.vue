<template>
  <div class="row q-py-md q-my-xs">
    <!-- headers -->
    <div class="col-12">
      <HeadersMotowork @open-modal="openModal" :title="'Administrador banners'" />
    </div>
    <!-- end headers -->

    <!--table Banners-->
    <TableMotowork :columns="bannersColums" :rows="banners" class="q-mt-lg" />
    <!--End table Banners-->

    <!--Modal Banners-->
    <q-dialog v-model="openModalBanners"></q-dialog>
    <!--End Modal Banners-->
  </div>
</template>

<script lang="ts">
import { useRoute } from 'vue-router'
import { useBannersStore } from 'src/stores/banners'
import TableMotowork from '../partials/tableMotowork.vue'
import HeadersMotowork from '../partials/headersMotowork.vue'
import { computed, defineComponent, onBeforeMount, ref } from 'vue'
import { TableColumnsInterface } from 'src/interfaces/tableInterface'
import { BannersInterface } from 'src/interfaces/bannersInterface'

export default defineComponent({
  name: 'MainBannersComponents',
  components: {
    HeadersMotowork,
    TableMotowork
  },
  setup() {
    // data
    const route = useRoute()
    const store = useBannersStore()
    const openModalBanners = ref<boolean>(false)
    const bannersColums = ref<TableColumnsInterface[]>([
      {
        name: 'location',
        label: 'Ubicación',
        field: 'name',
        align: 'left'
      },
      {
        name: 'link',
        label: 'Enlace directo',
        field: 'link',
        align: 'center'
      },
      {
        name: 'options',
        label: '',
        field: 'option'
      },
    ])

    // computed
    const banners = computed(() => {
      return store.banners
    })

    // methods
    const openModal = () => {
      openModalBanners.value = !openModalBanners.value
    }

    const listBanners = async () => {
      try {
        const page = route.query.page || 1
        const perPage = route.query.perPage || 12
        const search = route.query.search || ''
        const query = `?page=${page}&perPage=${perPage}&search=${search}`
        await store.listBanners(query)
      } catch (error) {
      }
    }

    // hook
    onBeforeMount(async () => {
      await listBanners()
    })

    // return statement
    return {
      banners,
      openModal,
      bannersColums,
      openModalBanners
    }
  }
})
</script>
