<template>
  <div class="row q-py-md q-my-xs">
    <!-- headers -->
    <div class="col-12">
      <HeadersMotowork @do-order="doOrder" :order-menu="orderMenu" :show-order-button="true" @open-modal="openModal"
        :title="'Categorías'" />
    </div>
    <!-- end headers -->

    <!--tab-->
    <div class="col-12 categories-tab">
      <q-tabs class="text-grey-7" v-model="tab" active-color="primary" indicator-color="primary" ina align="justify">
        <q-tab name="vehicle" label="MOTOCICLETAS" />
        <q-tab name="product" label="ACCESORIOS" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="vehicle">
          <div class="row full-width">
            <div class="col-12">
              <TableMotowork @do-toggle-status="doToggleStatus" :enableSelection="true" @do-edit="doEditCategory"
                @do-delete="deleteCategory" :columns="categoriesColums" :rows="categories" :totalPages="totalPages" />
            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="product">
          <div class="row full-width">
            <div class="col-12">
              <TableMotowork @do-toggle-status="doToggleStatus" :enableSelection="true" @do-edit="doEditCategory"
                @do-delete="deleteCategory" :columns="categoriesColums" :rows="categories" :totalPages="totalPages" />
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <!--End tab-->

    <!--Modal Banners-->
    <q-dialog v-model="openModalCategory" @before-hide="clearData">
      <CardModalMotowork :title="category._id ? `Editar categoría ${category.name}` : 'Nueva categoría'">
        <template v-slot:content>
          <FormCategory :category="category" @close-modal="openModal" />
        </template>
      </CardModalMotowork>
    </q-dialog>
    <!--End Modal Banners-->

    <!--delete dialog-->
    <q-dialog v-model="openDeleteDialog" persistent>
      <CardModalMotowork title="Eliminar categoría">
        <template v-slot:content>
          <DeleteModal @disable="confirmDisableCategory" :showDiabledBtn="true" @delete="confirmDeleteCategory"
            :idDelete="categoryToDelete" entity="Categoría" />
        </template>
      </CardModalMotowork>
    </q-dialog>
    <!--End delete dialog-->
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router'
import FormCategory from './components/form.vue'
import { notification } from 'src/boot/notification'
import { useCategoriesStore } from 'src/stores/category'
import TableMotowork from '../partials/tableMotowork.vue'
import HeadersMotowork from '../partials/headersMotowork.vue'
import DeleteModal from 'src/components/commons/DeleteModal.vue'
import CardModalMotowork from '../partials/cardModalMotowork.vue'
import { TableColumnsInterface } from 'src/interfaces/tableInterface'
import { computed, defineComponent, onBeforeMount, ref, watch } from 'vue'
import { CategoriesInterface, TypeCategory } from 'src/interfaces/categories.interface'
import { SortGroup, SortOption } from 'src/interfaces/api';

export default defineComponent({
  name: 'CategoriesMainComponent',
  components: {
    DeleteModal,
    FormCategory,
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
    const store = useCategoriesStore()
    const categoryToDelete = ref<string>('')
    const category = ref<CategoriesInterface>({
      icon: '',
      name: '',
      type: TypeCategory.vehicle
    })
    const openDeleteDialog = ref<boolean>(false)
    const openModalCategory = ref<boolean>(false)
    const categoriesColums = ref<TableColumnsInterface[]>([
      {
        name: 'category',
        label: 'Categoría',
        field: 'name',
        align: 'left'
      },
      {
        name: 'dateCategory',
        label: 'Fecha',
        field: 'createdAt',
        align: 'left'
      },
      //{
      //  name: 'asociated_items',
      //  label: 'Motocicletas Asociadas',
      //  field: 'asociated',
      //  align: 'left'
      //},
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
    const categories = computed(() => {
      return store.categories
    })

    const totalPages = computed(() => {
      return store.totalPages
    })

    // watch
    watch(tab, async (value) => {
      const page = 1
      const perPage = 7
      const type = value
      const sortBy = 'name'
      const order = 'asc'
      const search = route.query.search ? route.query.search as string : ''
      router.push({
        name: 'categories',
        query: {
          page,
          perPage,
          search,
          type,
          sortBy,
          order
        }
      })
    })

    // methods 
    const openModal = () => {
      openModalCategory.value = !openModalCategory.value
    }

    const clearData = () => {
      category.value = {
        icon: '',
        name: '',
        type: TypeCategory.vehicle
      }
    }

    const listCategories = async (): Promise<void> => {
      try {
        const page = route.query.page || 1
        const perPage = route.query.perPage || 7
        const search = route.query.search || ''
        const type = route.query.type || 'vehicle'
        const sortBy = route.query.sortBy || 'name'
        const order = route.query.order || 'asc'
        const query = `?page=${page}&perPage=${perPage}&search=${search}&type=${type}&sortBy=${sortBy}&order=${order}`
        await store.doListCategories(query)
      } catch (error) {
      }
    }

    const deleteCategory = async (id: string): Promise<void> => {
      openDeleteDialog.value = !openDeleteDialog.value
      categoryToDelete.value = id
    }

    const confirmDeleteCategory = (id: string): void => {
      q.dialog({
        dark: false,
        title: `Eliminar categoría`,
        message: `¿Deseas ejecutar esta acción?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        await doDeleteCategory(id);
      })
    }

    const doDeleteCategory = async (id: string): Promise<void> => {
      try {
        const response = await store.doDeleteCategory(id);
        if (response?.success) {
          notification('success', response?.message, 'success')
        }
      } catch (error) {
      }
    }

    const doEditCategory = (id: string): void => {
      const categoryStore = store.getById(id)
      category.value = categoryStore as CategoriesInterface
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

    const confirmDisableCategory = (id: string): void => {
      q.dialog({
        dark: false,
        title: `Desactivar categoría`,
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
        name: 'categories',
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
      await listCategories()

      if (route.query.type) {
        tab.value = route.query.type as string;
      }
    })

    return {
      tab,
      doOrder,
      category,
      clearData,
      openModal,
      orderMenu,
      categories,
      totalPages,
      doToggleStatus,
      doEditCategory,
      deleteCategory,
      categoryToDelete,
      categoriesColums,
      openDeleteDialog,
      openModalCategory,
      confirmDeleteCategory,
      confirmDisableCategory,
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
