<template>
  <div class="user-welcome-recently">
    <div class="title-section">
      <span class="title">
        Añadidos recientemente
      </span>
    </div>
    <div class="full-width q-px-md">
      <q-tabs v-model="tab" dense class="tabs-no-selected full-width tabs text-weight-bold" active-color="primary"
        indicator-color="primary" align="justify" narrow-indicator>
        <q-tab name="vehicle" label="motocicleta" />
        <q-tab name="accesories" label="Accesorios" />
      </q-tabs>
      <q-tab-panels class="full-width" v-model="tab" dense align="justify" narrow-indicator>
        <q-tab-panel name="vehicle" v-if="tab === 'vehicle'">
          <ListItems :items="lastVehicles" />
        </q-tab-panel>
        <q-tab-panel name="accesories" v-if="tab === 'accesories'">
          <ListItems :showBrandIcon="false" :items="lastAccesories" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ListItems from './listItems.vue'
import { ProductsInterface } from '@/interfaces/productsInterface'
import { RecentlyItemsInterface } from 'src/interfaces/dashboardInterface'

export default defineComponent({
  name: 'RecentlyComponents',
  components: {
    ListItems
  },
  props: {
    lastVehicles: {
      type: Array as () => ProductInterface[],
      default: () => []
    },
    lastAccesories: {
      type: Array as () => ProductInterface[],
      default: () => []
    }
  },
  setup() {
    // data
    const tab = ref<string>('vehicle')

    const accesoriesRecently = ref<RecentlyItemsInterface[]>([
      {
        category: "personalización",
        img: 'images/accesorio-01.svg',
        item_type: "new",
        name: "Accesorio 01",
        price: 100000
      },
      {
        category: "cascos",
        img: 'images/accesorio-02.svg',
        item_type: "used",
        name: "Accesorio 02",
        price: 500000
      },
      {
        category: "Repuestos",
        img: 'images/accesorio-03.svg',
        item_type: "new",
        name: "Accesorio 03",
        price: 1000000
      },
    ])

    return {
      tab,
      accesoriesRecently,
    }
  }
})
</script>
