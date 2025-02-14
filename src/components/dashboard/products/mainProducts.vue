<template>
  <div class="row q-py-md q-my-xs">
    <!--Header-->
    <div class="col-12">
      <HeadersMotowork :orderMenu="orderMenu" :filterItems="filterMenu" :show-order-button="true" @do-order="doOrder"
        @open-modal="pushRouter('createProduct')" :title="'Productos'" @do-filter="doFilter" />
    </div>
    <!--End header-->

    <!--tab-->
    <div class="col-12 categories-tab">
      <q-tabs class="text-grey-7" v-model="tab" active-color="primary" indicator-color="primary" ina align="justify">
        <q-tab @click="handlerChangeTab" name="vehicle" label="MOTOCICLETAS" />
        <q-tab @click="handlerChangeTab" name="product" label="ACCESORIOS" />
      </q-tabs>
    </div>
    <!--End tab-->

    <!--tab content-->
    <div class="col-12 q-mt-lg q-pt-lg" :class="{ 'q-pr-md': $q.screen.gt.sm }">
      <gridProducts :products="products" :totalPages="totalPages" />
    </div>
    <!--End tab content-->
  </div>
</template>

<script setup lang="ts">
// imports
import { useRouter, useRoute } from 'vue-router'
import gridProducts from './partials/gridProducts.vue'
import { useBrandsStore } from '../../../stores/brands'
import { SortGroup, SortOption } from '@/interfaces/api'
import { ref, computed, watch, onBeforeMount } from 'vue'
import { useProductsStore } from '../../../stores/products'
import HeadersMotowork from '../partials/headersMotowork.vue'
import { BrandsInterface } from '@/interfaces/brands.interface'

// references
const route = useRoute()
const tab = ref('vehicle')
const router = useRouter()
const store = useProductsStore()
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
  },
  {
    label: 'Precio',
    items: [
      {
        label: 'Menor precio',
        value: '1',
        by: 'price',
      },
      {
        label: 'Mayor precio',
        value: '-1',
        by: 'price',
      },
    ]
  }
])
const filterMenu = ref([
  {
    label: 'ESTADO',
    value: [],
    items: [
      {
        label: 'Activos',
        value: true,
        key: 'active'
      },
      {
        label: 'Inactivos',
        value: false,
        key: 'active'
      }
    ]
  }
])
const brandStore = useBrandsStore()

// computed
const products = computed(() => {
  return store.products
})

const brands = computed(() => {
  return brandStore.brands
})

const totalPages = computed(() => {
  return store.totalPages
})

// watch
watch(brands, (newValues: BrandsInterface[]) => {
  const filterObject: any = {
    label: 'MARCA',
    items: []
  }


  for (const brand of newValues) {
    const obj = {
      label: brand.name,
      value: brand.name,
      key: 'brand'
    }
    filterObject.items.push(obj);
  }
  const issetBrandFilterOption = filterMenu.value.find((item: any) => item.label === 'MARCA')
  if (!issetBrandFilterOption) {
    filterMenu.value.unshift(filterObject)
  }
})

// methods
const pushRouter = (routeName: string) => {
  router.push({
    name: routeName,
    query: {
      type: tab.value
    }
  });
};

const lisProducts = async (): Promise<void> => {
  try {
    const page = route.query.page || 1
    const perPage = route.query.perPage || 7
    const search = route.query.search || ''
    const type = route.query.type || 'vehicle'
    const sortBy = route.query.sortBy || 'name'
    const order = route.query.order || 'asc'
    const filter = route.query.filter || ''
    const query = `?page=${page}&perPage=${perPage}&search=${search}&type=${type}&sortBy=${sortBy}&order=${order}&filter=${filter}&fields=name,category,price,discount,state,brand_icon,model,banner`
    await store.doListProducts(query)
  } catch (error) {
  }
}

const doOrder = (item: SortOption): void => {
  const page = 1
  const perPage = route.query.perPage || 7
  const search = route.query.search || ''
  const type = route.query.type || 'vehicle'
  const sortBy = item.by
  const order = item.value
  const filter = route.query.filter || ''
  router.push({
    name: 'products',
    query: {
      page,
      perPage,
      search,
      type,
      sortBy,
      order,
      filter
    }
  })
}

const doFilter = (item: any) => {
  const page = 1;
  const perPage = route.query.perPage || 7
  const search = route.query.search || ''
  const type = route.query.type || 'vehicle'
  const sortBy = route.query.sortBy || 'name'
  const order = route.query.order || '1'
  const filter: any = {
    [item.key]: item.value
  }

  router.push({
    name: 'products',
    query: {
      page,
      perPage,
      search,
      type,
      sortBy,
      order,
      filter: JSON.stringify(filter)
    }
  })
}

const handlerChangeTab = () => {
  store.clearProducts()
  const page = 1
  const perPage = 10
  const type = tab.value
  const sortBy = route.query.sortBy ? route.query.sortBy : ''
  const order = route.query.order ? route.query.order : ''
  const search = route.query.search ? route.query.search : ''
  const filter = route.query.filter || ''
  store.clearProducts()
  router.push({
    name: 'products',
    query: {
      page,
      perPage,
      search,
      type,
      sortBy,
      order,
      filter
    }
  })
}

// hooks
onBeforeMount(async () => {
  if (route.query.type) {
    tab.value = route.query.type as string
  }
  await lisProducts()
  await brandStore.doListBrands(`?page=1&perPage=100&type=${tab.value}&fields=name`)
})
</script>

<style></style>