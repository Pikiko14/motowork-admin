<template>
  <div class="full-width q-py-md q-my-xs" :class="{ 'q-pr-md': $q.screen.gt.sm }">
    <q-form class="row" @submit="createBlogs">
      <!--title-->
      <div class="col-12">
        <div class="d-flex">
          <q-btn style="margin-left: -10px" @click="$router.go(-1)" rounded flat dense
            icon="img:/images/back_chevron.svg"></q-btn>
          <h2 class="title q-pl-sm" v-if="!blog._id">NUEVO EVENTO</h2>
          <h2 class="title q-pl-sm" v-if="blog._id">MODIFICAR EVENTO</h2>
        </div>
      </div>
      <!--end title-->

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
        <div class="banner-picker q-mt-20" v-if="renderFilePickerSection">
          <FilePickerMotowork :full-height="true" @delete-file="deleteFile" :isBackgroundImage="false" :type="'images'"
            @set-file="setFile" :maxFile="5" :entity="'Imágenes del producto'"
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
          <q-tab name="details" label="MAS DETALLES" />
        </q-tabs>

        <section class="fields-section">
          <q-tab-panels v-model="tabFields" animated>
            <q-tab-panel name="general">
              <GeneralData :blog="blog" />
            </q-tab-panel>
            <q-tab-panel name="details">
              <MoreDetails :blog="blog" />
            </q-tab-panel>
          </q-tab-panels>
        </section>

        <!--botones-->
        <div class="buttons-section">
          <div class="row">
            <div class="col-12 col-md-6"
              :class="{ 'q-pl-md q-pr-md': $q.screen.gt.sm, 'full-width q-mt-md': $q.screen.lt.md }">
              <q-btn :disabled="!enableSaveButton" :loading="loading" type="submit" unelevated square
                :label="blog._id ? 'Guardar' : 'Crear'" class="full-width q-mt-md btn-cancel-solid"></q-btn>
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
      <!--End form field-->
    </q-form>

    <!--Modal status-->
    <q-dialog v-model="openModalStatus">
      <CardModalMotowork :title="statusTitle">
        <template v-slot:content>
          <statusModal @do-try-egaint="openModalStatus = false" @do-continue="handlerSuccessCreation" :status="statusCreation" :description="statusDescription"></statusModal>
        </template>
      </CardModalMotowork>
    </q-dialog>
    <!--End modal status-->
  </div>
</template>

<script lang="ts" setup>
// imports
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogsStore } from '../../../stores/blog'
import GeneralData from './partials/generalData.vue'
import MoreDetails from './partials/moreDetails.vue'
import statusModal from '../partials/statusModal.vue'
import { BlogsInterface } from '@/interfaces/blogs.interface'
import CardModalMotowork from '../partials/cardModalMotowork.vue'
import FilePickerMotowork from '../partials/filePickerMotowork.vue'

// references
const tab = ref('desktop')
const store = useBlogsStore()
const tabFields = ref('general')
const blog = ref<BlogsInterface>({
  category: '',
  subcategory: '',
  title: '',
  description: '',
  more_details: '',
  images: []
})
const hasFile = ref<boolean>()
const loading = ref<boolean>(false)

// images references
const router = useRouter()
const statusTitle = ref<string>('')
const imagesMobile = ref<File[]>([])
const imagesDesktop = ref<File[]>([])
const openModalStatus = ref<boolean>(false)
const imagesMobileBase64 = ref<string[]>([])
const imagesDesktopBase64 = ref<string[]>([])
const statusCreation = ref<string>('success')
const renderFilePickerSection = ref<boolean>(true)
const statusDescription = ref<string>('¡Felicitaciones! Has creado una nueva entrada. Has agregado detalles e imágenes correctamente.')

// computed 
const enableSaveButton = computed(() => {
  return blog.value.title && blog.value.category && blog.value.description && imagesDesktop.value.length > 0
})

// methods
const createBlogs = async () => {
  try {
    loading.value = true
    const blogObjectResponse = await handlerSaveProduct(blog.value)
    let uploadFiles = null
    if (hasFile.value === true && blogObjectResponse._id) {
      uploadFiles = await handlerUploadFiles(blogObjectResponse._id)
    }
    if (blogObjectResponse._id || uploadFiles._id) {
      statusTitle.value = 'Entrada creada exitosamente'
      openModalStatus.value = true
      return true;
    }
    statusCreation.value = 'error'
    statusTitle.value = '¡UPS! ALGO HA FALLADO'
    statusDescription.value = 'Parece que ha habido un problema al crear tu entrada. Asegúrate de que has completado toda la información requerida en los campos obligatorios (*) antes de volver a intentarlo.'
  } catch (error) {
  } finally {
    loading.value = false
  }
}

const handlerSaveProduct = async (params: BlogsInterface) => {
  try {
    const response = await store.doSaveBlogs(params)
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

const deleteFile = (idx: number) => {
  if (tab.value === 'mobile') {
    imagesMobile.value.splice(idx, 1)
    imagesMobileBase64.value.splice(idx, 1)
  } else {
    imagesDesktop.value.splice(idx, 1)
    imagesDesktopBase64.value.splice(idx, 1)
  }
}

const setFile = (data: any) => {
  hasFile.value = true
  handlerDefaultImages(data)
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

const handlerSuccessCreation = () => {
  openModalStatus.value = false
  router.push({
    name: 'blogs',
    query: {
      page: 1,
      perPage: 10,
      search: '',
      sortBy: 'name',
      order: '1'
    }
  })
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