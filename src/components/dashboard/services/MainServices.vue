<template>
  <div class="row q-py-md q-my-xs">
    <!--Header-->
    <div class="col-12" :class="{ 'q-pr-md': q.screen.gt.sm }">
      <HeadersMotowork :filterItems="filterMenu" :showCalendar="true" :show-add-button="false"
        :show-order-button="false" :title="'Agenda servicio técnico'" @do-filter="doFilter" />
    </div>
    <!--End header-->

    <div class="col-12 q-mt-xl q-pr-md">
      <CalendarServices is-loading />
    </div>
  </div>
</template>

<script lang="ts" setup>
// imports
import { useQuasar, date } from "quasar";
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useServicesStore } from 'src/stores/services';
import HeadersMotowork from '../partials/headersMotowork.vue'
import CalendarServices from "./partials/CalendarServices.vue";

// references
const q = useQuasar()
const route = useRoute()
const loading = ref(true)
const router = useRouter()
const filterMenu = ref([
  {
    label: 'ESTADO DEL SERVICIO',
    value: [],
    items: [
      {
        label: 'Finalizado',
        value: 'Finalizado',
        key: 'status_service'
      },
      {
        label: 'Pendiente',
        value: 'Pendiente',
        key: 'status_service'
      },
      {
        label: 'Cancelado',
        value: 'Cancelado',
        key: 'status_service'
      }
    ]
  }
])
const store = useServicesStore()



// methods
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
    name: 'services',
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

const loadServices = async () => {
  loading.value = true
  try {
    const page = route.query.page || 1
    const perPage = route.query.perPage || 1000
    const search = route.query.a || ''
    const timeStamp = Date.now()
    const { startOfWeek, endOfWeek } = getWeekRange();
    const from = route.query.from
    const to = route.query.to
    const query = `?page=${page}&perPage=${perPage}&search=${search}&from=${from || startOfWeek}&to=${to || endOfWeek}`
    const response = await store.doLoadServices(query)
  } catch (error) {
  } finally {
    loading.value = true
  }
}

const getWeekRange = (dates = new Date()) => {
  const day = dates.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const startOfWeek = new Date(dates)
  startOfWeek.setDate(dates.getDate() + diffToMonday)
  startOfWeek.setHours(0, 0, 0, 0)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)
  return {
    startOfWeek: date.formatDate(startOfWeek, 'YYYY-MM-DD'),
    endOfWeek: date.formatDate(endOfWeek, 'YYYY-MM-DD')
  };
}

// hook
onBeforeMount(async () => {
  await loadServices()
})
</script>
