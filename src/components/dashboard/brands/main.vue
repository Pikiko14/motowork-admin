<template>
  <div class="row q-py-md q-my-xs">
    <!-- headers -->
    <div class="col-12">
      <HeadersMotowork @do-order="doOrder" :order-menu="orderMenu" :show-order-button="true" @open-modal="openModal"
        :title="'Marcas'" />
    </div>
    <!-- end headers -->

    <!--tab-->
    <div class="col-12 categories-tab">
      <q-tabs class="text-grey-7" v-model="tab" active-color="primary" indicator-color="primary" ina align="justify">
        <q-tab @click="handlerChangeType" name="vehicle" label="MOTOCICLETAS" />
        <q-tab @click="handlerChangeType" name="product" label="ACCESORIOS" />
      </q-tabs>
    </div>

    <div class="col-12 q-mt-lg">
      <TableMotowork class="q-pt-lg" @do-toggle-status="doToggleStatus" :enableSelection="true" @do-edit="doEditBrands"
        @do-delete="deleteBrands" :columns="brandsColums" :rows="brands" :totalPages="totalPages" />
    </div>
    <!--End tab-->

    <!--Modal Banners-->
    <q-dialog v-model="openModalBrands" @before-hide="clearData">
      <CardModalMotowork :title="brand._id ? `Editar marca ${brand.name}` : 'Nueva marca'">
        <template v-slot:content>
          <Formbrand :brand="brand" @close-modal="openModal" />
        </template>
      </CardModalMotowork>
    </q-dialog>
    <!--End Modal Banners-->

    <!--delete dialog-->
    <q-dialog v-model="openDeleteDialog" persistent>
      <CardModalMotowork title="Eliminar marca">
        <template v-slot:content>
          <DeleteModal @disable="confirmDisableBrands" :showDiabledBtn="true" @delete="confirmDeleteBrands"
            :idDelete="brandToDelete" entity="Marca" />
        </template>
      </CardModalMotowork>
    </q-dialog>
    <!--End delete dialog-->
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router'
import Formbrand from './components/form.vue'
import { notification } from 'src/boot/notification'
import { useBrandsStore } from 'src/stores/brands'
import TableMotowork from '../partials/tableMotowork.vue'
import HeadersMotowork from '../partials/headersMotowork.vue'
import DeleteModal from 'src/components/commons/DeleteModal.vue'
import CardModalMotowork from '../partials/cardModalMotowork.vue'
import { TableColumnsInterface } from 'src/interfaces/tableInterface'
import { computed, defineComponent, onBeforeMount, ref } from 'vue'
import { BrandsInterface, Typebrand } from 'src/interfaces/brands.interface'
import { SortGroup, SortOption } from 'src/interfaces/api';

export default defineComponent({
  name: 'BrandsMainComponent',
  components: {
    DeleteModal,
    Formbrand,
    TableMotowork,
    HeadersMotowork,
    CardModalMotowork,
  },
  setup() {
    // data
    const q = useQuasar()
    const route = useRoute()
    const router = useRouter()
    const tab = ref<string>('vehicle')
    const store = useBrandsStore()
    const brandToDelete = ref<string>('')
    const brand = ref<BrandsInterface>({
      icon: '',
      name: '',
      type: Typebrand.vehicle
    })
    const openDeleteDialog = ref<boolean>(false)
    const openModalBrands = ref<boolean>(false)
    const brandsColums = ref<TableColumnsInterface[]>([
      {
        name: 'brand',
        label: 'Marca',
        field: 'name',
        align: 'left'
      },
      {
        name: 'dateCategory',
        label: 'Fecha',
        field: 'createdAt',
        align: 'left'
      },
      // {
      //   name: 'asociated_items',
      //   label: 'Motocicletas Asociadas',
      //   field: 'asociated',
      //   align: 'left'
      // },
      {
        name: 'options',
        label: '',
        field: 'option'
      },
    ])
    const orderMenu = ref<SortGroup[]>([
      {
        label: 'Alfabeticamente',
        items: [
          {
            label: 'De la A - Z',
            value: '1',
            by: 'name',
          },
          {
            label: 'De la Z- A',
            value: '-1',
            by: 'name',
          },
        ]
      },
      {
        label: 'Creación',
        items: [
          {
            label: 'Agregados recientemente',
            value: '-1',
            by: 'createdAt',
          },
          {
            label: 'Agregados anteriormente',
            value: '1',
            by: 'createdAt',
          },
        ]
      }
    ])

    // computed
    const brands = computed(() => {
      return store.brands
    })

    const totalPages = computed(() => {
      return store.totalPages
    })

    // methods 
    const openModal = () => {
      openModalBrands.value = !openModalBrands.value
    }

    const clearData = () => {
      brand.value = {
        icon: '',
        name: '',
        type: Typebrand.vehicle
      }
    }

    const listBrands = async (): Promise<void> => {
      try {
        const page = route.query.page || 1
        const perPage = route.query.perPage || 7
        const search = route.query.search || ''
        const type = route.query.type || 'vehicle'
        const sortBy = route.query.sortBy || 'name'
        const order = route.query.order || 'asc'
        const query = `?page=${page}&perPage=${perPage}&search=${search}&type=${type}&sortBy=${sortBy}&order=${order}`
        await store.doListBrands(query)
      } catch (error) {
      }
    }

    const deleteBrands = async (id: string): Promise<void> => {
      openDeleteDialog.value = !openDeleteDialog.value
      brandToDelete.value = id
    }

    const confirmDeleteBrands = (id: string): void => {
      q.dialog({
        dark: false,
        title: `Eliminar marca`,
        message: `¿Deseas ejecutar esta acción?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        await doDeleteBrands(id);
      })
    }

    const doDeleteBrands = async (id: string): Promise<void> => {
      try {
        const response = await store.doDeleteBrand(id);
        if (response?.success) {
          notification('success', response?.message, 'success')
        }
      } catch (error) {
      }
    }

    const doEditBrands = (id: string): void => {
      const brandStore = store.getById(id)
      brand.value = brandStore as BrandsInterface
      openModal()
    }

    const doToggleStatus = async (id: string): Promise<void> => {
      try {
        const response = await store.doChangeStatus(id);
        if (response?.success) {
          notification('success', response?.message, 'success')
        }
      } catch (error) {
      }
    }

    const confirmDisableBrands = (id: string): void => {
      q.dialog({
        dark: false,
        title: `Desactivar marca`,
        message: `¿Deseas ejecutar esta acción?`,
        cancel: true,
        persistent: true
      })
        .onOk(async () => {
          await doToggleStatus(id);
        })
    }

    const doOrder = (item: SortOption): void => {
      const page = 1
      const perPage = route.query.perPage || 7
      const search = route.query.search || ''
      const type = route.query.type || 'vehicle'
      const sortBy = item.by
      const order = item.value
      router.push({
        name: 'brands',
        query: {
          page,
          perPage,
          search,
          type,
          sortBy,
          order
        }
      })
    }

    const handlerChangeType = () => {
      store.clearBrands()
      const page = 1
      const perPage = 7
      const type = tab.value
      const sortBy = route.query.sortBy ? route.query.sortBy : ''
      const order = route.query.order ? route.query.order : ''
      const search = route.query.search ? route.query.search as string : ''
      router.push({
        name: 'brands',
        query: {
          page,
          perPage,
          search,
          type,
          sortBy,
          order
        }
      })
    }

    // life cycle
    onBeforeMount(async () => {
      if (route.query.type) {
        tab.value = route.query.type as string;
      }
      await listBrands()
    })

    return {
      tab,
      doOrder,
      brand,
      clearData,
      openModal,
      orderMenu,
      brands,
      totalPages,
      doToggleStatus,
      doEditBrands,
      deleteBrands,
      brandToDelete,
      brandsColums,
      openDeleteDialog,
      openModalBrands,
      handlerChangeType,
      confirmDeleteBrands,
      confirmDisableBrands,
    }
  }
})
</script>

<style scoped>
.q-tab__indicator {
  width: 0%;
  left: -20px;
}
</style>
