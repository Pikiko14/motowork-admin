<template>
  <div class="row q-py-md q-my-xs">
    <!--Header-->
    <div class="col-12">
      <HeadersMotowork :show-order-button="true" @open-modal="pushRouter('createProduct')" :title="'Productos'" />
    </div>
    <!--End header-->

    <!--tab-->
    <div class="col-12 categories-tab">
      <q-tabs class="text-grey-7" v-model="tab" active-color="primary" indicator-color="primary" ina align="justify">
        <q-tab name="vehicle" label="MOTOCICLETAS" />
        <q-tab name="product" label="ACCESORIOS" />
      </q-tabs>
    </div>
    <!--End tab-->

    <!--tab content-->
    <div class="col-12">
      {{ products }}
    </div>
    <!--End tab content-->
  </div>
</template>

<script setup lang="ts">
// imports
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, watch, onBeforeMount } from 'vue'
import { useProductsStore } from '../../../stores/products'
import HeadersMotowork from '../partials/headersMotowork.vue'

// references
const route = useRoute()
const tab = ref('vehicle')
const router = useRouter()
const store = useProductsStore()


// computed
const products = computed(() => {
  return store.products
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
    name: 'products',
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
    const query = `?page=${page}&perPage=${perPage}&search=${search}&type=${type}&sortBy=${sortBy}&order=${order}`
    await store.doListProducts(query)
  } catch (error) {
  }
}

// hooks
onBeforeMount(async () => {
  if (route.query.type) {
    tab.value = route.query.type as string;
  }
  await lisProducts()
})
</script>

<style></style>