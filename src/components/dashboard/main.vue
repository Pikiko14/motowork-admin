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
    <div class="col-12 col-md-3 q-mt-xl">
      <q-card square class="shadow-0 bordered">
        <q-card-section class="title-section">
          <p class="title">Sesión Instagram</p>
          <q-icon size="16pt" name="img:images/instagram.png"></q-icon>
        </q-card-section>
        <q-card-section v-if="!instagramData.userId && sessionLoaded" class="d-flex justify-center">
          <q-btn type="a" target="__blank" :href="`${url}/api/v1/instagrams/auth`" v-if="!instagramData.userId" color="secondary" unelevated label="Iniciar sesión"></q-btn>
        </q-card-section>
        <q-card-section v-if="instagramData.userId && sessionLoaded" class="title-section">
          <p class="title d-flex space-between">
            <span class="text-bold">
              Usuario:
            </span>
            <span class="no-bold q-pl-sm">
              {{ instagramData.response.username }}
            </span>
          </p>

          <q-btn type="a" target="__blank" :href="`${url}/api/v1/instagrams/validate-and-extend-token`" rounded size="8pt" class="float-right" flat dense icon="img:images/rotate.png" color="secondary">
            <q-tooltip class="bg-secondary">
              Refrescar sesión
            </q-tooltip>
          </q-btn>
        </q-card-section>
      </q-card>
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
    const instagramData = ref<any>({})
    const sessionLoaded = ref<boolean>(false)
    const loadingInstragram = ref<boolean>(false)
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

    const validateInstagramSession = async () => {
      loadingInstragram.value = true
      try {
        const response = await authStore.doValidateInstagramSession()
        console.log(response)
        instagramData.value = response
      } catch (error) {
      } finally {
        loadingInstragram.value = false
        sessionLoaded.value = true
      }
    }

    const loadPorductsPublishCount = async () => {
      try {
        const response = await productStore.loadPublishProducts()
      } catch (error) {
        console.log(erorr)
      }
    }

    // hook
    onBeforeMount(async () => {
      await loadProductCount()
      await validateInstagramSession()
      await loadPorductsPublishCount()
    })

    return {
      user,
      instagramData,
      countVehicles,
      lastVehicles,
      lastAccesories,
      sessionLoaded,
      loadingInstragram,
      url: process.env.API_URL
    }
  }
})
</script>

<style scoped>
.bordered {
  border: 1px solid var(--Neutrals-Neutrals100, #e3e3e3);
}

.title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  color: var(--Primary-Primary, #000);
  font-family: Play;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
  text-transform: uppercase;
}

.bordered p {
  font-size: 14px;
}

.title .no-bold {
  font-weight: 400;
}
</style>
