<template>
  <div class="row q-py-md q-my-xs">
    <!-- headers -->
    <div class="col-12">
      <HeadersMotowork @open-modal="openModal" :title="'Administrador banners'" />
    </div>
    <!-- end headers -->

    <!--table Banners-->
    <TableMotowork @do-delete="doDeleteBanner" :columns="bannersColums" :rows="banners" class="q-mt-lg"
      :totalPages="totalPages" />
    <!--End table Banners-->

    <!--Modal Banners-->
    <q-dialog v-model="openModalBanners">
      <CardModalMotowork :title="'Crear banners'">
        <template v-slot:content>
          <FormBanner @close-modal="openModal" />
        </template>
      </CardModalMotowork>
    </q-dialog>
    <!--End Modal Banners-->
  </div>
</template>

<script lang="ts">
import { useRoute } from 'vue-router'
import FormBanner from './components/form.vue'
import { useBannersStore } from 'src/stores/banners'
import TableMotowork from '../partials/tableMotowork.vue'
import HeadersMotowork from '../partials/headersMotowork.vue'
import CardModalMotowork from '../partials/cardModalMotowork.vue'
import { computed, defineComponent, onBeforeMount, ref } from 'vue'
import { TableColumnsInterface } from 'src/interfaces/tableInterface'
import { useQuasar } from 'quasar'
import { notification } from 'src/boot/notification'

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

    const doDeleteBanner = async (id: string) => {
      q.dialog({
        dark: false,
        title: 'Eliminar banner',
        message: '¿Deseas eliminar el banner?',
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
          notification('positive', response?.message, 'green')
        }
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
      totalPages,
      bannersColums,
      doDeleteBanner,
      openModalBanners
    }
  }
})
</script>
