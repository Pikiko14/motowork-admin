<template>
  <div class="row q-py-md q-my-xs">
    <!--Header-->
    <div class="col-12" :class="{ 'q-pr-md': $q.screen.gt.sm }">
      <HeadersMotowork :show-add-button="false" :orderMenu="orderMenu" :show-order-button="true" @do-order="doOrder"
        :title="'Ordenes'" @do-filter="doFilter" />
    </div>
    <!--End header-->

    <!--tab-->
    <div class="col-12 categories-tab">
      <q-tabs class="text-grey-7" v-model="tab" active-color="primary" indicator-color="primary" ina align="justify">
        <q-tab name="orders" label="Pedidos" />
        <q-tab name="drive" label="Manejo" />
      </q-tabs>
    </div>
    <!--End tab-->

    <!--tab content-->
    <div class="col-12 categories-tab q-pt-lg" :class="{ 'q-pr-md': $q.screen.gt.sm }">
      <TableMotowork :enableSelection="false" :columns="tab === 'orders' ? orderColumns : orderColumnsDrive" :rows="orders" :totalPages="totalPages" />
    </div>
    <!--End tab content-->
  </div>
</template>

<script lang="ts" setup>
import { Utils } from 'src/utils/utils'
import { useRoute, useRouter } from 'vue-router'
import { useOrdersStore } from 'src/stores/orders'
import { SortGroup, SortOption } from '@/interfaces/api'
import TableMotowork from '../partials/tableMotowork.vue'
import { computed, onBeforeMount, ref, watch } from 'vue'
import HeadersMotowork from '../partials/headersMotowork.vue'
import { TableColumnsInterface } from '@/interfaces/tableInterface'

// references
const tab = ref('orders')
const route = useRoute()
const router = useRouter()
const store = useOrdersStore()
const utils = new Utils('orders')
const orderMenu = ref<SortGroup[]>([
  {
    label: 'Creación',
    items: [
      {
        label: 'Agregadas recientemente',
        value: '-1',
        by: 'createdAt',
      },
      {
        label: 'Agregadas anteriormente',
        value: '1',
        by: 'createdAt',
      },
    ]
  },
  {
    label: 'Total',
    items: [
      {
        label: 'Menor total',
        value: '1',
        by: 'total',
      },
      {
        label: 'Mayor total',
        value: '-1',
        by: 'total',
      },
    ]
  }
])

const orderColumns = ref<TableColumnsInterface[]>([
  {
    name: 'reference',
    label: '# Orden',
    field: '_id',
    align: 'left'
  },
  {
    name: 'dateCategory',
    label: 'Fecha',
    field: 'createdAt',
    align: 'left'
  },
  {
    name: 'clientName',
    label: 'Cliente',
    field: 'client',
    align: 'left'
  },
  {
    name: 'paymentStatus',
    label: 'Estado de pago',
    field: 'status',
    align: 'center'
  },
  {
    name: 'total',
    label: 'Total',
    field: row => utils.formatPrice(row.total || 0),
    align: 'center'
  },
  {
    name: 'options',
    label: '',
    field: 'option'
  },
])

const orderColumnsDrive = ref<TableColumnsInterface[]>([
  {
    name: 'reference',
    label: '# Orden',
    field: '_id',
    align: 'left'
  },
  {
    name: 'dateOrder',
    label: 'Fecha y hora',
    field: 'serviceTime',
    align: 'left'
  },
  {
    name: 'clientNameOrder',
    label: 'Cliente',
    field: 'client',
    align: 'left'
  },
  {
    name: 'vehicle',
    label: 'Vehiculo',
    field: 'vehicle',
    align: 'left'
  },
  {
    name: 'options',
    label: '',
    field: 'option'
  },
])

// computed
const orders = computed(() => store.orders)
const totalPages = computed(() => store.totalPages)

// watch
watch(tab, (value) => {
  const page = 1
  const perPage = 10
  const type = value === 'orders' ? 'Sales Order' : 'Test Drive Request'
  const sortBy = route.query.sortBy ? route.query.sortBy : ''
  const order = route.query.order ? route.query.order : ''
  const search = route.query.search ? route.query.search : ''
  const filter = route.query.filter || ''
  store.clearOrders()
  router.push({
    name: 'orders',
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
})

// methods
const doOrder = (item: SortOption): void => {
  const page = 1
  const perPage = route.query.perPage || 7
  const search = route.query.search || ''
  const type = route.query.type || 'vehicle'
  const sortBy = item.by
  const order = item.value
  const filter = route.query.filter || ''
  router.push({
    name: 'orders',
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
    name: 'orders',
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

const loadOrder = async () => {
  try {
    const page = route.query.page || 1
    const perPage = route.query.perPage || 7
    const search = route.query.search || ''
    const type = route.query.type || 'Sales Order'
    const sortBy = route.query.sortBy || 'client'
    const order = route.query.order || 'asc'
    const query = `?page=${page}&perPage=${perPage}&search=${search}&type=${type}&sortBy=${sortBy}&order=${order}`
    await store.listOrders(query)
  } catch (error) {
  }
}

// hook
onBeforeMount(async (): Promise<void> => {
  if (route.query.type) {
    tab.value = route.query.type === 'Sales Order' ? 'orders' : 'drive'
  }
  await loadOrder()
})
</script>
