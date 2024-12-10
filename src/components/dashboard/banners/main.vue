<template>
  <div class="row q-py-md q-my-xs">
    <!-- headers -->
    <div class="col-12">
      <HeadersMotowork @open-modal="openModal" :title="'Administrador banners'" />
    </div>
    <!-- end headers -->

    <!--table Banners-->
    <TableMotowork @do-edit="doEdit" @do-delete="doDeleteBanner" :columns="bannersColums" :rows="banners"
      class="q-mt-lg" :totalPages="totalPages" />
    <!--End table Banners-->

    <!--Modal Banners-->
    <q-dialog v-model="openModalBanners" @before-hide="clearData">
      <CardModalMotowork :title="banner._id ? `Modificar banner ${banner.name}` : 'Crear banners'">
        <template v-slot:content>
          <FormBanner @close-modal="openModal" :bannerData="banner" />
        </template>
      </CardModalMotowork>
    </q-dialog>
    <!--End Modal Banners-->
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import FormBanner from './components/form.vue'
import { useBannersStore } from 'src/stores/banners'
import { notification } from 'src/boot/notification'
import TableMotowork from '../partials/tableMotowork.vue'
import HeadersMotowork from '../partials/headersMotowork.vue'
import CardModalMotowork from '../partials/cardModalMotowork.vue'
import { computed, defineComponent, onBeforeMount, ref } from 'vue'
import { TableColumnsInterface } from 'src/interfaces/tableInterface'
import { BannersInterface, TypeBanner } from 'src/interfaces/bannersInterface'

export default defineComponent({
  name: 'MainBannersComponents',
  components: {
    FormBanner,
    TableMotowork,
    HeadersMotowork,
    CardModalMotowork
  },
  setup() {
    // data
    const q = useQuasar()
    const route = useRoute()
    const banner = ref<BannersInterface>({
      name: '',
      link: '',
      type: TypeBanner.home,
      images: [],
      is_active: false
    })
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

    const totalPages = computed(() => {
      return store.totalPages
    })

    // methods
    const openModal = () => {
      openModalBanners.value = !openModalBanners.value
    }

    const clearData = () => {
      if (openModalBanners.value === false) {
        banner.value = {
          name: '',
          link: '',
          type: TypeBanner.home,
          images: [],
          is_active: false
        }
      }
    }

    const listBanners = async (): Promise<void> => {
      try {
        const page = route.query.page || 1
        const perPage = route.query.perPage || 12
        const search = route.query.search || ''
        const query = `?page=${page}&perPage=${perPage}&search=${search}`
        await store.listBanners(query)
      } catch (error) {
      }
    }

    const doDeleteBanner = async (id: string) => {
      const banner = store.getBannerById(id)
      q.dialog({
        dark: false,
        title: 'Eliminar banner',
        message: `¿Deseas eliminar el banner ${banner?.name || ''}`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        await confirmDeleteBanner(id)
      })
    }

    const confirmDeleteBanner = async (id: string) => {
      try {
        const response = await store.doDeleteBanners(id);
        if (response?.success) {
          notification('success', response?.message, 'success')
        }
      } catch (error) {
      }
    }

    const doEdit = (id: string) => {
      const bannerStore = store.getBannerById(id)
      banner.value = bannerStore
      openModal()
    }

    // hook
    onBeforeMount(async () => {
      await listBanners()
    })

    // return statement
    return {
      banner,
      doEdit,
      banners,
      clearData,
      openModal,
      totalPages,
      bannersColums,
      doDeleteBanner,
      openModalBanners
    }
  }
})
</script>
