<template>
  <div class="full-width q-py-md q-my-xs" :class="{ 'q-pr-md': $q.screen.gt.sm }">
    <!--Formulario-->
    <q-form class="row" @submit="createProduct">
      <div class="col-12">
        <div class="d-flex">
          <q-btn style="margin-left: -10px" @click="$router.go(-1)" rounded flat dense
            icon="img:/images/back_chevron.svg"></q-btn>
          <h2 class="title q-pl-sm" v-if="!product._id">NUEVO PRODUCTO</h2>
          <h2 class="title q-pl-sm" v-if="product._id">MODIFICAR PRODUCTO</h2>
        </div>
      </div>
      <!--Files-->
      <div class="col-12 col-md-5" :class="{ 'q-pr-lg': $q.screen.gt.sm }">
        <!--<q-tabs class="text-grey-7" v-model="tab" active-color="primary" indicator-color="primary" ina align="justify">
          <q-tab name="desktop" label="DESKTOP" />
          <<q-tab name="mobile" label="MOBILE" />
        </q-tabs>-->
        <div class="information">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M8.0013 15.3332C12.0514 15.3332 15.3346 12.0499 15.3346 7.99984C15.3346 3.94975 12.0514 0.666504 8.0013 0.666504C3.95122 0.666504 0.667969 3.94975 0.667969 7.99984C0.667969 12.0499 3.95122 15.3332 8.0013 15.3332ZM6.0013 7.6665H7.33464V10.3332H6.0013V11.6665H10.0013V10.3332H8.66797V6.33317H6.0013V7.6665ZM8.66797 5.33317V3.99984H7.33464V5.33317H8.66797Z"
              fill="#B2B2B2" />
          </svg>
          <p>Para una experiencia visual óptima y sin errores en todas las pantallas, se recomienda cargar un archivo
            específico para cada dispositivo, respetando sus dimensiones nativas.</p>
        </div>
        <div class="banner-picker" v-if="renderFilePickerSection">
          <FilePickerMotowork :productImages="product.banner as any"
            :base64Image="tab === 'desktop' ? desktopBannerBase64 : mobileBannerBase64" :type="'banner'"
            @set-file="setFile" :maxFile="1" :entity="'Banner producto'"
            :resolutionLabel="'Resolución mínima 1280 X 450 Px'" />
        </div>
        <div class="banner-picker q-mt-20" v-if="renderFilePickerSection">
          <FilePickerMotowork :productImages="product.images" @delete-file="deleteFile" :isBackgroundImage="false"
            :type="'images'" @set-file="setFile" :maxFile="5" :entity="'Imágenes del producto'"
            :resolutionLabel="'Resolución mínima 1080 X 1080 Px'" :base64Image="''"
            :arrayBase64="tab === 'desktop' ? imagesDesktopBase64 : imagesMobileBase64" />
        </div>
      </div>
      <!--End Files-->

      <!--form field-->
      <div class="col-12 col-md-7" :class="{ 'q-pl-lg': $q.screen.gt.sm, 'q-mt-xl': $q.screen.lt.md }">
        <q-tabs class="text-grey-7" v-model="tabFields" active-color="primary" indicator-color="primary" ina
          align="justify">
          <q-tab name="general" label="INFO. GENERAL" />
          <q-tab name="details"
            :label="type === 'vehicle' || product && product.type === 'vehicle' ? 'DETALLES' : 'VARIABLES'" />
          <q-tab name="aditional" label="INFO. ADICIONAL" />
        </q-tabs>

        <section class="fields-section">
          <q-tab-panels v-model="tabFields" animated>
            <q-tab-panel name="general">
              <generalFields :product="product" />
            </q-tab-panel>
            <q-tab-panel name="details">
              <detailFields v-if="type === 'vehicle' || product.type === 'vehicle'" :product="product" />
              <VariablesProduct v-if="type === 'product' || product.type === 'product'" :product="product"
                @add-variant="handleAddVariant" @remove-variant="removeVariant" @set-image-variant="setImgVariant" />
            </q-tab-panel>
            <q-tab-panel name="aditional">
              <infoAditionalFields :product="product" />
            </q-tab-panel>
          </q-tab-panels>
        </section>

        <!--botones-->
        <div class="buttons-section">
          <div class="row">
            <div class="col-12 col-md-6"
              :class="{ 'q-pl-md q-pr-md': $q.screen.gt.sm, 'full-width q-mt-md': $q.screen.lt.md }">
              <q-btn :disabled="!enableSaveButton" :loading="loading" type="submit" unelevated square
                :label="product._id ? 'Guardar' : 'Crear'" class="full-width q-mt-md btn-cancel-solid"></q-btn>
            </div>
            <div class="col-12 col-md-6"
              :class="{ 'q-pr-md q-pl-md': $q.screen.gt.sm, 'full-width q-mt-md': $q.screen.lt.md }">
              <q-btn @click="$router.go(-1)" v-close-popup outline square label="Cancelar"
                class="full-width q-mt-md btn-cancel"></q-btn>
            </div>
          </div>
        </div>
        <!--End botones-->
      </div>
      <!--End Form Fields-->
    </q-form>
    <!--End Formulario-->

    <!--Modal status-->
    <q-dialog v-model="openModalStatus">
      <CardModalMotowork :title="statusTitle">
        <template v-slot:content>
          <statusModal @do-try-egaint="openModalStatus = false" @do-continue="handlerSuccessCreation"
            :status="statusCreation" :description="statusDescription"></statusModal>
        </template>
      </CardModalMotowork>
    </q-dialog>
    <!--End modal status-->
  </div>
</template>

<script lang="ts" setup>
// imports
import { useRoute, useRouter } from 'vue-router'
import statusModal from '../partials/statusModal.vue'
import detailFields from './partials/detailFields.vue'
import generalFields from './partials/generalFields.vue'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useProductsStore } from '../../../stores/products'
import VariablesProduct from './partials/variablesProduct.vue'
import CardModalMotowork from '../partials/cardModalMotowork.vue'
import { ProductsInterface } from '@/interfaces/productsInterface'
import FilePickerMotowork from '../partials/filePickerMotowork.vue'
import infoAditionalFields from './partials/infoAditionalFields.vue'

// references
const route = useRoute()
const tab = ref('desktop')
const router = useRouter()
const type = route.query.type
const hasFile = ref<boolean>()
const tabFields = ref('general')
const store = useProductsStore()
const statusTitle = ref<string>('')
const loading = ref<boolean>(false)
const openModalStatus = ref<boolean>(false)
const statusCreation = ref<string>('success')
const renderFilePickerSection = ref<boolean>(true)
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
  sku: '',
  type: '',
  dive_test: false,
  enableDiscount: false,
  details: {
    power: 0,
    weight: '',
    max_power: '',
    torque: '',
    type_engine: '',
    colors: []
  },
  additionalInfo: [],
  variants: []
})
const statusDescription = ref<string>('¡Felicitaciones! Has creado un nuevo producto. Has agregado detalles, imágenes y  precios correctamente.')

// banners references
const bannerMobile = ref(null)
const bannerDesktop = ref(null)
const mobileBannerBase64 = ref('')
const desktopBannerBase64 = ref('')

// images references
const imagesMobile = ref<File[]>([])
const imagesDesktop = ref<File[]>([])
const imagesMobileBase64 = ref<string[]>([])
const imagesDesktopBase64 = ref<string[]>([])

// watch
watch(
  () => tab.value,
  () => {
    renderFilePicker()
  }
)

// computed
const enableSaveButton = computed(() => {
  if (type === 'vehicle' || product.value && product.value.type === 'vehicle') {
    return product.value.name &&
      product.value.model &&
      product.value.state &&
      product.value.brand &&
      product.value.price &&
      product.value.category &&
      product.value.details.power &&
      product.value.details.max_power &&
      product.value.details.power &&
      product.value.details.type_engine &&
      product.value.details.colors.length > 0
  } else {
    return product.value.name &&
      product.value.model &&
      product.value.state &&
      product.value.brand &&
      product.value.price &&
      product.value.category &&
      product.value.sku
  }
})

// methods
const setFile = (data: any) => {
  hasFile.value = true
  switch (data.type) {
    case 'banner':
      handlerBannerFile(data)
      break;

    default:
      handlerDefaultImages(data)
      break;
  }
}

const handlerBannerFile = (data: any) => {
  if (tab.value === 'mobile') {
    bannerMobile.value = data.filePicker
    mobileBannerBase64.value = data.base64
  } else {
    bannerDesktop.value = data.filePicker
    desktopBannerBase64.value = data.base64
  }
}

const handlerDefaultImages = (data: any) => {
  if (tab.value === 'mobile') {
    imagesMobile.value.push(data.filePicker)
    imagesMobileBase64.value.push(data.base64)
  } else {
    imagesDesktop.value.push(data.filePicker)
    imagesDesktopBase64.value.push(data.base64)
  }
}

const renderFilePicker = () => {
  renderFilePickerSection.value = false
  setTimeout(() => {
    renderFilePickerSection.value = true
  }, 100)
}

const deleteFile = (idx: number) => {
  if (tab.value === 'mobile') {
    imagesMobile.value.splice(idx, 1)
    imagesMobileBase64.value.splice(idx, 1)
  } else {
    imagesDesktop.value.splice(idx, 1)
    imagesDesktopBase64.value.splice(idx, 1)
  }
}

const createProduct = async () => {
  if (product.value && product.value._id) {
    await updateProduct();
    return true;
  }
  loading.value = true
  try {
    const { type } = route.query
    product.value.type = type as string
    const saveProductObject = await handlerSaveProduct(product.value) // save product json
    let uploadFiles = null
    if (hasFile.value === true && saveProductObject._id) {
      uploadFiles = await handlerUploadFiles(saveProductObject._id)
    }
    if (saveProductObject._id || uploadFiles._id) {
      statusTitle.value = 'Producto creado exitosamente'
      openModalStatus.value = true
      return true;
    }
    statusCreation.value = 'error'
    statusTitle.value = '¡UPS! ALGO HA FALLADO'
    statusDescription.value = 'Parece que ha habido un problema al crear tu producto. Asegúrate de que has completado toda la información requerida en los campos obligatorios (*) antes de volver a intentarlo.'
  } catch (error) {
  } finally {
    loading.value = false
  }
}

const updateProduct = async () => {
  loading.value = true
  try {
    const updateProductObject = await handlerUpdateProduct(product.value) // save product json
    let uploadFiles = null
    if (hasFile.value === true && updateProductObject._id) {
      uploadFiles = await handlerUploadFiles(updateProductObject._id)
    }
    if (updateProductObject._id || uploadFiles._id) {
      statusTitle.value = 'Producto modificado exitosamente'
      openModalStatus.value = true
      return true;
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

const handlerUpdateProduct = async (params: ProductsInterface) => {
  try {
    const response = await store.doUpdateProduct(params)
    if (response?.success) {
      return response.data
    }
    return false
  } catch (error) {
  }
}

const handlerSaveProduct = async (params: ProductsInterface) => {
  try {
    const response = await store.doSaveProduct(params)
    if (response?.success) {
      return response.data
    }
    return false
  } catch (error) {
  }
}

const handlerUploadFiles = async (id: string) => {
  try {
    const form = new FormData()

    // validate banners
    form.append('id', id)
    form.append('bannerMobile', bannerMobile.value ? bannerMobile.value : '')
    form.append('bannerDesktop', bannerDesktop.value ? bannerDesktop.value : '')

    // validate images products
    imagesMobile.value.forEach((file) => form.append("imagesMobile", file))
    imagesDesktop.value.forEach((file) => form.append("imagesDesktop", file))
    const response = await store.doUploadFiles(form)

    if (response.success) {
      return response.data
    }
    return false
  } catch (error) {
  }
}

const handlerSuccessCreation = () => {
  openModalStatus.value = false
  router.push({
    name: 'products',
    query: {
      type: route.query.type,
      page: 1,
      perPage: 10,
      search: '',
      sortBy: 'name',
      order: '1'
    }
  })
}

const loadProduct = async (id: string) => {
  try {
    const dataProduct = await store.doFilterProduct(id)
    if (dataProduct && dataProduct.product) {
      product.value = JSON.parse(JSON.stringify(dataProduct.product))
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

const handleAddVariant = () => {
  const variant = {
    sku: '',
    attribute: '',
    description: '',
    image: '',
  }
  if (product.value.variants) {
    product.value.variants.push(variant)
  }
}

const removeVariant = (idx: number) => {
  if (product.value.variants) {
    product.value.variants.splice(idx, 1)
  }
}

const setImgVariant = (data: any) => {
  if (product.value.variants) {
    product.value.variants[data.variantIdx].image = data.imgPath
  }
}

// hook
onBeforeMount(async () => {
  if (route.params.id) {
    await loadProduct(route.params.id as string)
  }
})
</script>

<style lang="scss" scoped>
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

.information {
  margin-top: 20px;
  margin-bottom: 20px;
  color: #9F9C9C;
  font-family: Ubuntu;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
  /* 12.5px */
  display: flex;
  gap: 12px;
}

.fields-section {
  min-height: 515px;
}
</style>
