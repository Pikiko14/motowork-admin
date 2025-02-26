<template>
  <div class="row q-py-md q-my-xs">
    <!--Header-->
    <div class="col-12" :class="{ 'q-pr-md': q.screen.gt.sm }">
      <HeadersMotowork @do-search="doSearch" :filterItems="filterMenu" :show-add-button="false" :show-order-button="false"
        :title="'Agenda servicio técnico'" @do-filter="doFilter" />
    </div>
    <!--End header-->

    <div class="col-12 q-mt-xl q-pr-md">
      <CalendarServices @filter-by-period="filterByMode" @filter-by-mode="filterByMode" is-loading
        :events="servicesSchedule" />
    </div>
  </div>
</template>

<script lang="ts" setup>
// imports
import { useQuasar, date } from "quasar"
import { onBeforeMount, ref } from "vue"
import { useRoute } from "vue-router"
import { useServicesStore } from 'src/stores/services'
import HeadersMotowork from '../partials/headersMotowork.vue'
import CalendarServices from "./partials/CalendarServices.vue"
import { ServiceInterface } from "@/interfaces/services.interface"

// references
const q = useQuasar()
const periodSelected = ref({
  start: '',
  end: ''
})
const route = useRoute()
const oldSearch = ref('')
const loading = ref(true)
const filterMenu = ref([
  {
    label: 'ESTADO DEL SERVICIO',
    value: [],
    items: [
      {
        label: 'Aceptada',
        value: 'aceptada',
        key: 'status_service'
      },
      {
        label: 'Confirmada',
        value: 'confirmada',
        key: 'status_service'
      },
      {
        label: 'Completada',
        value: 'completada',
        key: 'status_service'
      },
      {
        label: 'Pendiente',
        value: 'pendiente',
        key: 'status_service'
      },
      {
        label: 'Rechazada',
        value: 'rechazada',
        key: 'status_service'
      }
    ]
  }
])
const store = useServicesStore()
const servicesSchedule = ref([])

// methods
const doFilter = async (item: any) => {
  const page = route.query.page || 1
  const perPage = route.query.perPage || 1000
  const filter: any = {
    [item.key]: item.value
  }
  try {
    const query = `?page=${page}&perPage=${perPage}&search=${oldSearch.value}&from=${periodSelected.value.start}&to=${periodSelected.value.end}&filter=${JSON.stringify(filter)}`
    const response = await store.doLoadServices(query)
    if (response?.success) {
      processServices(response.data)
    }
  } catch (error) {
    console.error(error)
  }
}

const loadServices = async () => {
  loading.value = true
  try {
    const page = route.query.page || 1
    const perPage = route.query.perPage || 1000
    const search = route.query.search || ''
    const { startOfWeek, endOfWeek } = getWeekRange();
    periodSelected.value = {
      start: startOfWeek,
      end: endOfWeek
    }
    const query = `?page=${page}&perPage=${perPage}&search=${search}&from=${startOfWeek}&to=${endOfWeek}`
    const response = await store.doLoadServices(query)
    if (response?.success) {
      processServices(response.data)
    }
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
    startOfWeek: date.formatDate(startOfWeek, 'YYYY/MM/DD'),
    endOfWeek: date.formatDate(endOfWeek, 'YYYY/MM/DD')
  };
}

const getDate = (dateString: string) => {
  return dateString.split('T').shift()
}

const getTime = (time: string) => {
  const newTime = date.formatDate(date.addToDate(`2000-01-01 ${time}`, { hours: 1 }), "HH:mm")
  return newTime
}

const filterByMode = async (period: any) => {
  periodSelected.value = period
  const page = route.query.page || 1
  const perPage = route.query.perPage || 1000
  const search = route.query.search || ''
  try {
    const query = `?page=${page}&perPage=${perPage}&search=${search}&from=${period.start}&to=${period.end}`
    const response = await store.doLoadServices(query)
    if (response?.success) {
      processServices(response.data)
    }
  } catch (error) {
    console.error(error)
  }
}

const processServices = (arr: any) => {
  servicesSchedule.value = []
  servicesSchedule.value = arr.map((e: ServiceInterface) => {
    return {
      title: "Servicio tecnico",
      with: `${e?.client?.name} ${e?.client?.lastName}`,
      time: { start: `${getDate(e?.date as any)} ${e?.hour}`, end: `${getDate(e?.date as any)} ${getTime(e?.hour)}` },
      color: "yellow",
      isEditable: false,
      id: e?._id,
      description: e?.complement
    }
  })
}

const doSearch = async (search: string) => {
  oldSearch.value = search
  const page = route.query.page || 1
  const perPage = route.query.perPage || 1000
  try {
    const query = `?page=${page}&perPage=${perPage}&search=${search}&from=${periodSelected.value.start}&to=${periodSelected.value.end}`
    const response = await store.doLoadServices(query)
    if (response?.success) {
      processServices(response.data)
    }
  } catch (error) {
    console.error(error)
  }
}

// hook
onBeforeMount(async () => {
  await loadServices()
})
</script>
