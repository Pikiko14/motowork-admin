<template>
  <div class="full-width q-py-md q-my-xs" :class="{ 'q-pr-md': $q.screen.gt.sm }">
    <q-form class="row" @submit="createProduct">
      <div class="col-12">
        <div class="d-flex">
          <q-btn style="margin-left: -10px" @click="$router.go(-1)" rounded flat dense
            icon="img:/images/back_chevron.svg"></q-btn>
          <h2 class="title q-pl-sm">NUEVO PRODUCTO</h2>
        </div>
      </div>
      <!--Files-->
      <div class="col-12 col-md-5" :class="{ 'q-pr-lg': $q.screen.gt.sm }">
        <q-tabs class="text-grey-7" v-model="tab" active-color="primary" indicator-color="primary" ina align="justify">
          <q-tab name="desktop" label="DESKTOP" />
          <q-tab name="mobile" label="MOBILE" />
        </q-tabs>
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
          <FilePickerMotowork :base64Image="tab === 'desktop' ? desktopBannerBase64 : mobileBannerBase64"
            :type="'banner'" @set-file="setFile" :maxFile="1" :entity="'Banner producto'"
            :resolutionLabel="'Resolución mínima 1280 X 450 Px'" />
        </div>
        <div class="banner-picker q-mt-20" v-if="renderFilePickerSection">
          <FilePickerMotowork @delete-file="deleteFile" :isBackgroundImage="false" :type="'images'" @set-file="setFile"
            :maxFile="5" :entity="'Imágenes del producto'" :resolutionLabel="'Resolución mínima 1080 X 1080 Px'"
            :base64Image="''" :arrayBase64="tab === 'desktop' ? imagesDesktopBase64 : imagesMobileBase64" />
        </div>
      </div>
      <!--End Files-->

      <!--form field-->
      <div class="col-12 col-md-7" :class="{ 'q-pl-lg': $q.screen.gt.sm }">
        <q-tabs class="text-grey-7" v-model="tabFields" active-color="primary" indicator-color="primary" ina
          align="justify">
          <q-tab name="general" label="INFO. GENERAL" />
          <q-tab name="details" label="DETALLES" />
          <q-tab name="aditional" label="INFO. ADICIONAL" />
        </q-tabs>

        <section class="fields-section">
          <q-tab-panels v-model="tabFields" animated>
            <q-tab-panel name="general">
              <generalFields :product="product" />
            </q-tab-panel>
            <q-tab-panel name="details">
              <detailFields :product="product" />
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
              <q-btn :disabled="!enableSaveButton" :loading="loading" type="submit" unelevated square label="Crear"
                class="full-width q-mt-md btn-cancel-solid"></q-btn>
            </div>
            <div class="col-12 col-md-6"
              :class="{ 'q-pr-md q-pl-md': $q.screen.gt.sm, 'full-width q-mt-md': $q.screen.lt.md }">
              <q-btn @click="$router.go(-1)" v-close-popup outline square label="Cancelar" class="full-width q-mt-md btn-cancel"></q-btn>
            </div>
          </div>
        </div>
        <!--End botones-->
      </div>
      <!--End Form Fields-->
    </q-form>
  </div>
</template>

<script lang="ts" setup>
// imports
import { computed, ref, watch } from 'vue'
import detailFields from './partials/detailFields.vue'
import generalFields from './partials/generalFields.vue'
import { notification } from '../../../boot/notification'
import { useProductsStore } from '../../../stores/products'
import { ProductsInterface } from '@/interfaces/productsInterface'
import FilePickerMotowork from '../partials/filePickerMotowork.vue'
import infoAditionalFields from './partials/infoAditionalFields.vue'

// references
const tab = ref('desktop')
const tabFields = ref('general')
const store = useProductsStore()
const loading = ref<boolean>(false)
const renderFilePickerSection = ref<boolean>(true)
const product = ref<ProductsInterface>({
  name: '',
  model: '',
  state: 'Nueva',
  brand: '',
  price: null,
  discount: null,
  category: '',
  description: '',
  banner: '',
  images: [],
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
  return product.value.name &&
    product.value.model &&
    product.value.state &&
    product.value.brand &&
    product.value.price &&
    product.value.description &&
    product.value.category &&
    product.value.details.power &&
    product.value.details.licenseType &&
    product.value.details.storage &&
    product.value.details.testDrive &&
    product.value.details.colors.length > 0
})

// methods
const setFile = (data: any) => {
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
  try {
    await handlerSaveProduct(product.value); // save product json
  } catch (error) {
  } finally {
    loading.value = false
  }
}

const handlerSaveProduct = async (params: ProductsInterface) => {
  try {
    const response = await store.doSaveProduct(params);
    if (response?.success) {
      notification('success', response?.message, 'success')
    }
  } catch (error) {
  }
}
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
