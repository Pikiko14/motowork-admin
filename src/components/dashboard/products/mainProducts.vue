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
  </div>
</template>

<script setup lang="ts">
// imports
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import HeadersMotowork from '../partials/headersMotowork.vue'

// references
const tab = ref('vehicle')
const router = useRouter()

// methods
const pushRouter = (routeName: string) => {
  router.push({
    name: routeName,
    query: {
      type: tab.value
    }
  });
};

</script>

<style></style>