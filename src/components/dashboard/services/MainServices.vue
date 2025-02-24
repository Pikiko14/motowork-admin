<template>
  <div class="row q-py-md q-my-xs">
    <!--Header-->
    <div class="col-12" :class="{ 'q-pr-md': q.screen.gt.sm }">
      <HeadersMotowork :filterItems="filterMenu" :showCalendar="true" :show-add-button="false" :show-order-button="false"
        :title="'Agenda servicio técnico'" @do-filter="doFilter" />
    </div>
    <!--End header-->
  </div>
</template>

<script lang="ts" setup>
// imports
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import HeadersMotowork from '../partials/headersMotowork.vue'

// references
const q = useQuasar()
const route = useRoute()
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
</script>
