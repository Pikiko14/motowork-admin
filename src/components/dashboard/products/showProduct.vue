<template>
  <section class="full-width q-py-md q-my-xs" :class="{ 'q-pr-md': $q.screen.gt.sm }">
    <div class="row">
      <!--header-->
      <div class="col-12">
        <div class="d-flex">
          <q-btn style="margin-left: -10px" @click="$router.go(-1)" rounded flat dense
            icon="img:/images/back_chevron.svg"></q-btn>
          <h2 class="title q-pl-sm">Detalle del producto</h2>
        </div>
      </div>
      <!--end header-->

      <!--Gallery section-->
      <div class="col-12 col-md-5" v-if="product && product?._id" :class="{ 'q-pr-lg': $q.screen.gt.sm }">
        <q-tabs class="text-grey-7" v-model="tab" active-color="primary" indicator-color="primary" ina align="justify">
          <q-tab name="desktop" label="DESKTOP" />
          <q-tab name="mobile" label="MOBILE" />
        </q-tabs>

        <div class="full-width q-mt-lg">
          <ProductsGallery :tab="tab" :images="product?.images" :banners="product?.banner" />
        </div>
      </div>
      <!--End Gallery section-->

    </div>
  </section>
</template>

<script lang="ts" setup>
// imports
import { useRoute } from 'vue-router';
import { onBeforeMount, ref } from 'vue';
import ProductsGallery from './partials/productsGallery.vue';
import { useProductsStore } from '../../../stores/products';
import { ProductsInterface } from '@/interfaces/productsInterface';

// references
const route = useRoute()
const tab = ref('desktop')
const product = ref<ProductsInterface>({
  name: '',
  model: '',
  state: 'Nueva',
  brand: '',
  brand_icon: '',
  price: null,
  discount: null,
  category: '',
  description: '',
  banner: [],
  images: [],
  type: '',
  enableDiscount: false,
  details: {
    power: '',
    licenseType: '',
    storage: '',
    testDrive: '',
    colors: []
  },
  additionalInfo: [],
})
const store = useProductsStore()

// methods
const loadProduct = async (id: string) => {
  const dataProduct = await store.doFilterProduct(id)
  if (dataProduct && dataProduct.product) {
    product.value = dataProduct.product
  }
}

// hook
onBeforeMount(async () => {
  const { id } = route.params
  await loadProduct(id as string)
})
</script>

<style scoped>
.title {
  color: #000;
  font-family: Play;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
  /* 30px */
  text-transform: uppercase;
}
</style>
