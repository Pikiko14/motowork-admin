<template>
  <div class="row q-py-md q-my-xs">
    <div class="col-12 col-md-8" :class="{ 'q-pr-md': $q.screen.gt.sm }">
      <div class="user-welcome-title full-width q-pb-sm">
        Hola, <span class="text-secondary">{{ user.name }} {{ user.last_name }}</span> Bienvenido
      </div>
      <span class="user-welcome-subtitle">
        Supervisa y gestiona tu inventario de motocicletas y accesorios de manera eficiente.
      </span>
      <div class="user-welcome-item-section q-mt-xl">
        <CardMetrics :title="'Motocicletas'" />
        <CardMetrics :title="'Accesorios'" />
        <CardMetrics :title="'Total productos'" />
      </div>
      <div class="user-welcome-metrics-bars q-mt-lg">
        <ChartComponent />
      </div>
    </div>
    <div class="col-12 col-md-4" :class="{ 'q-px-md': $q.screen.gt.sm }">
      <RecentlyProducts />
    </div>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from 'src/stores/auth'
import { computed, defineComponent } from 'vue'
import CardMetrics from './main/cardMetrics.vue'
import ChartComponent from './main/chartComponent.vue'
import RecentlyProducts from './main/recentlyProducts.vue'

export default defineComponent({
  name: 'MainComponent',
  components: {
    CardMetrics,
    ChartComponent,
    RecentlyProducts
  },
  setup() {
    // data
    const authStore = useAuthStore()

    // computed
    const user = computed(() => {
      return authStore.user
    })

    return {
      user
    }
  }
})
</script>
