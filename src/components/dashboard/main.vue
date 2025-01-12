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
        <CardMetrics :amount="countVehicles.vehicle" :title="'Motocicletas'" />
        <CardMetrics :amount="countVehicles.accesories" :title="'Accesorios'" />
        <CardMetrics :amount="countVehicles.vehicle + countVehicles.accesories" :title="'Total productos'" />
      </div>
      <div class="user-welcome-metrics-bars q-mt-lg">
        <ChartComponent />
      </div>
    </div>
    <div class="col-12 col-md-4" :class="{ 'q-px-md': $q.screen.gt.sm }">
      <RecentlyProducts :lastVehicles="lastVehicles" :lastAccesories="lastAccesories" />
    </div>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from 'src/stores/auth'
import CardMetrics from './main/cardMetrics.vue'
import ChartComponent from './main/chartComponent.vue'
import { useProductsStore } from '../../stores/products'
import RecentlyProducts from './main/recentlyProducts.vue'
import { ProductsInterface } from '@/interfaces/productsInterface'
import { computed, defineComponent, onBeforeMount, ref } from 'vue'

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
    const countVehicles = ref<any>({
      vehicle: 0,
      accesories: 0,
    })
    const lastVehicles = ref<ProductsInterface[]>([])
    const lastAccesories = ref<ProductsInterface[]>([])
    const productStore = useProductsStore()

    // computed
    const user = computed(() => {
      return authStore.user
    })

    // methods
    const loadProductCount = async () => {
      const response = await productStore.loadCountProduct()
      countVehicles.value.vehicle = response.countVehicle
      countVehicles.value.accesories = response.countAccesories
      lastVehicles.value = response.lastVehicles
      lastAccesories.value = response.lastProduct	
    }

    // hook
    onBeforeMount(async () => {
      await loadProductCount()
    })

    return {
      user,
      countVehicles,
      lastVehicles,
      lastAccesories
    }
  }
})
</script>
