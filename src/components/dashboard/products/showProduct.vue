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

      <!--Data section-->
      <div class="col-12 col-md-7" :class="{ 'q-pl-lg q-pr-lg': $q.screen.gt.sm, 'q-mt-xl': $q.screen.lt.md }">
        <!--Title section-->
        <div class="col-12">
          <div class="title-section">
            <ToggleInput v-model="product.active" size="sm" />
            <span class="title-section__title">
              {{ product.name }}
            </span>
            <div class="chip" :class="{ 'news': product.state === 'Nueva', 'used': product.state === 'Usada' }">
              {{ product.state }}
            </div>
          </div>
        </div>
        <!--End title section-->
        
        <!--Tabs-->
        <q-tabs class="text-grey-7 q-mt-lg" v-model="tabFields" active-color="primary" indicator-color="primary" ina
          align="justify">
          <q-tab name="general" label="INFO. GENERAL" />
          <q-tab name="details" label="DETALLES" />
          <q-tab name="aditional" label="INFO. ADICIONAL" />
        </q-tabs>
        <!--End tab section-->

        <!--Tabs data section-->
        <section class="fields-section q-mt-lg">
          <q-tab-panels v-model="tabFields" animated class="q-pa-none">
            <q-tab-panel name="general" class="q-pa-none">
              <GeneralShowData :product="product" />
            </q-tab-panel>
            <q-tab-panel name="details">
              <DetailShowData :product="product" />
            </q-tab-panel>
            <q-tab-panel name="aditional">
              3
            </q-tab-panel>
          </q-tab-panels>
        </section>
        <!--End tab data section-->

        <!--buttons-->
        <div class="col-12 q-mt-xl">
          <div class="row">
            <div class="col-12 col-md-6"
              :class="{ 'q-pr-md': $q.screen.gt.sm, 'full-width': $q.screen.lt.md }">
              <q-btn unelevated square label="Editar"
                class="full-width q-mt-md btn-cancel-solid"></q-btn>
            </div>
            <div class="col-12 col-md-6"
              :class="{ 'q-pl-md': $q.screen.gt.sm, 'full-width': $q.screen.lt.md }">
              <q-btn @click="$router.go(-1)" color="secondary" unelevated square label="Eliminar"
                class="full-width q-mt-md btn-cancel"></q-btn>
            </div>
          </div>
        </div>
        <!--End buttons-->
      </div>
      <!--End data section-->

    </div>
  </section>
</template>

<script lang="ts" setup>
// imports
import { useRoute } from 'vue-router';
import { onBeforeMount, ref } from 'vue';
import DetailShowData from './partials/detailShowData.vue';
import { useProductsStore } from '../../../stores/products';
import GeneralShowData from './partials/generalShowData.vue';
import ProductsGallery from './partials/productsGallery.vue';
import ToggleInput from 'src/components/commons/ToggleInput.vue'
import { ProductsInterface } from '@/interfaces/productsInterface';

// references
const route = useRoute()
const tab = ref('desktop')
const tabFields = ref('general')
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

<style scoped lang="scss">
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

.fields-section {
  min-height: 400px;
}

.title-section {
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: center;

  &__title {
    color: #000;
    font-family: Play;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 125%; /* 30px */
    text-transform: uppercase;
  }
}
</style>
