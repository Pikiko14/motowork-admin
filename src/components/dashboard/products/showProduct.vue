<template>
  <section class="full-width q-py-md q-my-xs" :class="{ 'q-pr-md': $q.screen.gt.sm }">
    <div class="row" v-if="product && product._id">
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
          <ProductsGallery @do-delete-img="deleteImgProduct" :tab="tab" :images="product?.images" :banners="product?.banner" />
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
            <q-tab-panel name="details" class="q-pa-none">
              <DetailShowData :product="product" class="q-pa-none" />
            </q-tab-panel>
            <q-tab-panel name="aditional" class="q-pa-none">
              <AditionalShowData :product="product" />
            </q-tab-panel>
          </q-tab-panels>
        </section>
        <!--End tab data section-->

        <!--buttons-->
        <div class="col-12 q-mt-xl">
          <div class="row">
            <div class="col-12 col-md-6" :class="{ 'q-pr-md': $q.screen.gt.sm, 'full-width': $q.screen.lt.md }">
              <q-btn :to="`/dashboard/products/${product._id}/edit`" unelevated square label="Editar" class="full-width q-mt-md btn-cancel-solid"></q-btn>
            </div>
            <div class="col-12 col-md-6" :class="{ 'q-pl-md': $q.screen.gt.sm, 'full-width': $q.screen.lt.md }">
              <q-btn @click="deleteProducts(product._id as string)" color="secondary" unelevated square label="Eliminar"
                class="full-width q-mt-md btn-cancel"></q-btn>
            </div>
          </div>
        </div>
        <!--End buttons-->
      </div>
      <!--End data section-->

      <!--delete dialog-->
      <q-dialog v-model="openDeleteDialog" persistent>
        <CardModalMotowork title="Eliminar producto">
          <template v-slot:content>
            <DeleteModal :showDiabledBtn="true" @delete="confirmDeleteProduct" :idDelete="productToDelete"
              entity="Producto" />
          </template>
        </CardModalMotowork>
      </q-dialog>
      <!--End delete dialog-->
    </div>
  </section>
</template>

<script lang="ts" setup>
// imports
import { useQuasar } from 'quasar'
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { notification } from 'src/boot/notification'
import DetailShowData from './partials/detailShowData.vue'
import { useProductsStore } from '../../../stores/products'
import GeneralShowData from './partials/generalShowData.vue'
import ProductsGallery from './partials/productsGallery.vue'
import ToggleInput from 'src/components/commons/ToggleInput.vue'
import AditionalShowData from './partials/aditionalShowData.vue'
import DeleteModal from 'src/components/commons/DeleteModal.vue'
import CardModalMotowork from '../partials/cardModalMotowork.vue'
import { ProductImagesInterface, ProductsInterface } from '@/interfaces/productsInterface'

// references
const q = useQuasar()
const route = useRoute()
const router = useRouter()
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
    weight: '',
    max_power: '',
    torque: '',
    type_engine: '',
    colors: []
  },
  additionalInfo: [],
})
const store = useProductsStore()
const productToDelete = ref<string>('')
const openDeleteDialog = ref<boolean>(false)

// methods
const loadProduct = async (id: string) => {
  try {
    const dataProduct = await store.doFilterProduct(id)
    if (dataProduct && dataProduct.product) {
      product.value = dataProduct.product
    }
  } catch (error: any) {
    router.push({
      name: 'products',
      query: {
        page: 1,
        perPage: 10,
        search: '',
        type: route.query.type || 'vehicle',
        sortBy: 'name',
        order: '1'
      }
    });
  }
}

const confirmDeleteProduct = (id: string) => {
  q.dialog({
    dark: false,
    title: `Eliminar producto`,
    message: `¿Deseas ejecutar esta acción?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await doDeleteProduct(id);
  })
}

const doDeleteProduct = async (id: string) => {
  try {
    const response = await store.doDeleteProduct(id)
    if (response.success) {
      notification('success', response.message, 'success')
      router.push({
        name: 'products',
        query: {
          page: 1,
          perPage: 10,
          search: '',
          type: route.query.type || 'vehicle',
          sortBy: 'name',
          order: '1'
        }
      })
    }
  } catch (error) {
  }
}

const deleteProducts = async (id: string): Promise<void> => {
  openDeleteDialog.value = !openDeleteDialog.value
  productToDelete.value = id
}

const deleteImgProduct = async (img: ProductImagesInterface) => {
  const imgIndex = product.value.images.findIndex((item: ProductImagesInterface) => {
    return item._id === img._id
  })
  try {
    const response = await store.doDeleteProductImage(product.value._id, img._id);
    if (response.success) {
      notification('positive', 'Se ha eliminado la imagen del producto.', 'primary')
      product.value.images.splice(imgIndex, 1)
    }
  } catch (error) {
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
    line-height: 125%;
    /* 30px */
    text-transform: uppercase;
  }
}
</style>
