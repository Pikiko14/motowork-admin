<template>
  <div class="row q-py-md q-my-xs">
    <!-- headers -->
    <div class="col-12">
      <HeadersMotowork @open-modal="openModal" :title="'Categorías'" />
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
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { computed, defineComponent, onBeforeMount, ref, watch } from 'vue'
import FormCategory from './components/form.vue'
import { notification } from 'src/boot/notification'
import { useCategoriesStore } from 'src/stores/category'
import TableMotowork from '../partials/tableMotowork.vue'
import HeadersMotowork from '../partials/headersMotowork.vue'
import CardModalMotowork from '../partials/cardModalMotowork.vue'
import { TableColumnsInterface } from 'src/interfaces/tableInterface'
import { CategoriesInterface, TypeCategory } from 'src/interfaces/categories.interface'
import { ResponseObj } from 'src/interfaces/api'

export default defineComponent({
  name: 'CategoriesMainComponent',
  components: {
    FormCategory,
    HeadersMotowork,
    CardModalMotowork,
    TableMotowork
  },
  setup() {
    // data
    const q = useQuasar()
    const route = useRoute()
    const router = useRouter()
    const tab = ref<string>('vehicle')
    const store = useCategoriesStore()
    const category = ref<CategoriesInterface>({
      icon: '',
      name: '',
      type: TypeCategory.vehicle
    })
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
      {
        name: 'asociated_items',
        label: 'Motocicletas Asociadas',
        field: 'asociated',
        align: 'left'
      },
      {
        name: 'options',
        label: '',
        field: 'option'
      },
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
      const search = route.query.search ? route.query.search as string : ''
      router.push({
        name: 'categories',
        query: {
          page,
          perPage,
          search,
          type
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
        const perPage = route.query.perPage || 12
        const search = route.query.search || ''
        const type = route.query.type || 'vehicle'
        const query = `?page=${page}&perPage=${perPage}&search=${search}&type=${type}`
        await store.doListCategories(query)
      } catch (error) {
      }
    }

    const deleteCategory = async (id: string): Promise<void> => {
      const category = store.getById(id)
      q.dialog({
        dark: false,
        title: 'Eliminar categoría',
        message: `¿Deseas eliminar la categoría ${category?.name || ''}`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        await store.doDeleteCategory(id)
        notification('positive', 'Categoría eliminada', 'success')
      })
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
          notification('positive', response?.message, 'success')
        }
      } catch (error) {
      }
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
      category,
      clearData,
      openModal,
      categories,
      totalPages,
      doToggleStatus,
      doEditCategory,
      deleteCategory,
      categoriesColums,
      openModalCategory,
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
