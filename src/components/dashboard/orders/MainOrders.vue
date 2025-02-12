<template>
  <div class="row q-py-md q-my-xs">
    <!--Header-->
    <div class="col-12" :class="{ 'q-pr-md': q.screen.gt.sm }">
      <HeadersMotowork :showCalendar="true" :show-add-button="false" :orderMenu="orderMenu" :show-order-button="true" @do-order="doOrder"
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
    <div class="col-12 categories-tab q-pt-lg" :class="{ 'q-pr-md': q.screen.gt.sm }">
      <TableMotowork
        :enableSelection="false"
        :columns="tab === 'orders' ? orderColumns : orderColumnsDrive"
        :rows="orders"
        :totalPages="totalPages"
        @do-show-detail="handlerShowOrder"
      />
    </div>
    <!--End tab content-->

    <!--Dialog order-->
    <q-dialog v-model="showOrder">
      <q-card>
        <q-card-section class="order-show">
          <div class="row">
            <div class="col-12">
              <h1>
                <span class="text-bold">Pedido </span>
                <span>
                  #{{ orderToShow._id }}
                </span>
              </h1>
            </div>
          </div>

          <q-btn class="absolute-top-right" style="right: 10px; top: 15px" v-close-popup icon="img:/images/close.svg" flat dense></q-btn>
        </q-card-section>

        <q-card-section style="margin-top: -10px">
          <ShowOrder :order="orderToShow" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!--End dialog order-->
  </div>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { Utils } from 'src/utils/utils'
import ShowOrder from './partials/ShowOrder.vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrdersStore } from 'src/stores/orders'
import { SortGroup, SortOption } from '@/interfaces/api'
import TableMotowork from '../partials/tableMotowork.vue'
import { computed, onBeforeMount, ref, watch } from 'vue'
import HeadersMotowork from '../partials/headersMotowork.vue'
import { OrderInterface } from 'src/interfaces/ordersInterface'
import { TableColumnsInterface } from '@/interfaces/tableInterface'

// references
const q = useQuasar()
const route = useRoute()
const tab = ref('orders')
const router = useRouter()
const store = useOrdersStore()
const orderToShow = ref<any>({})
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
const showOrder = ref<boolean>(false)
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
    const filter = route.query.filter || ''
    const query = `?page=${page}&perPage=${perPage}&search=${search}&type=${type}&sortBy=${sortBy}&order=${order}&filter=${filter}`
    await store.listOrders(query)
  } catch (error) {
  }
}

const loadCountOrder = async () => {
  try {
    await store.getCountOrders()
  } catch (error) {
  }
}

const handlerShowOrder = (id: string) => {
  const order = orders.value.find((item: OrderInterface) => item._id === id)
  showOrder.value = !showOrder.value
  orderToShow.value = order as OrderInterface
}

// hook
onBeforeMount(async (): Promise<void> => {
  if (route.query.type) {
    tab.value = route.query.type === 'Sales Order' ? 'orders' : 'drive'
  }
  await loadOrder()
  await loadCountOrder()
})
</script>

<style scoped lang="scss">
.q-card {
  width: 960px;
  max-width: 1200px;
}

.order-show {
  width: 100%;
  max-width: 1600px;

  h1 {
    margin: 0;
    font-size: 24px;
    line-height: 120%;
  }

  @media(max-width: 767px) {
    max-width: 100%;
  }
}
</style>
