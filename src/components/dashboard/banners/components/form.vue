<template>
  <q-form @submit="doSaveBanners" class="row banner-form">
    <div class="col-12">
      <q-tabs v-model="tab" dense class="tabs-no-selected full-width tabs text-weight-bold" active-color="primary"
        indicator-color="primary" align="justify" narrow-indicator>
        <q-tab name="desktop" label="Desktop" />
        <q-tab name="table" label="tablet" />
        <q-tab name="mobile" label="mobile" />
      </q-tabs>
    </div>
    <div class="col-12">
      <q-tab-panels class="full-width" v-model="tab" dense align="justify" narrow-indicator>
        <q-tab-panel name="desktop" v-if="tab === 'desktop'">
          <FilePickerMotowork :type="'desktop'" @set-file="setFile" :base64Image="desktopBase64" />
        </q-tab-panel>
        <q-tab-panel name="table" v-if="tab === 'table'">
          <FilePickerMotowork :base64Image="tableBase64" resolutionLabel="Resolución mínima 330 X 465 Px"
            :type="'tablet'" @set-file="setFile" />
        </q-tab-panel>
        <q-tab-panel name="mobile" v-if="tab === 'mobile'">
          <FilePickerMotowork :base64Image="mobileBase64" resolutionLabel="Resolución mínima 320 X 350 Px "
            :type="'mobile'" @set-file="setFile" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <div class="col-12 col-md-6 q-px-md q-pt-sm q-mt-md">
      <span class="label-banner-form">
        Nombre del banner
      </span>
    </div>
    <div class="col-12 col-md-6 q-px-md q-mt-md">
      <q-input square :rules="[
        val => (val && val.length > 0) || 'Por favor ingrese el nombre del banner',
        val => (val && val.length >= 5) || 'Mayor a 5 caracteres',
        val => (val && val.length <= 90) || 'Menor a 90 caracteres'
      ]" placeholder="Banner 01" outlined dense v-model="banner.name"></q-input>
    </div>
    <div class="col-12 col-md-6 q-px-md q-pt-md">
      <span class="label-banner-form">
        Enlace directo
      </span>
    </div>
    <div class="col-12 col-md-6 q-px-md q-mt-sm">
      <q-input square :rules="[
        val => (val && val.length > 0) || 'Por favor ingrese el nombre del banner',
        val => (val && val.length >= 5) || 'Mayor a 5 caracteres',
        val => (val && val.length <= 160) || 'Menor a 90 caracteres',
        val => /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9#]+\/?)*$/.test(val) || 'Debe ser un link correcto'
      ]" placeholder="https://www.google.com" outlined dense v-model="banner.link"></q-input>
    </div>
    <div class="col-12 col-md-6 q-px-md q-pt-md">
      <span class="label-banner-form">
        Tipo de banner
      </span>
    </div>
    <div class="col-12 col-md-6 q-px-md q-mt-sm">
      <q-select square emit-value map-options :rules="[(val) => !!val || 'Selecciona una opción']" outlined dense
        v-model="banner.type" :options="bannerTypeOptions"></q-select>
    </div>
    <div class="col-8 col-md-6 q-px-md q-pt-md">
      <span class="label-banner-form">
        Activar banner
      </span>
    </div>
    <div class="col-4 col-md-6 q-pr-sm q-mt-sm text-right">
      <q-checkbox left-label :label="banner.is_active ? 'Activo' : 'Inactivo'" v-model="banner.is_active"
        color="secondary" bg-color="white"></q-checkbox>
    </div>
    <div class="col-12 col-md-6 q-mt-sm"
      :class="{ 'q-pr-sm q-pl-md': $q.screen.gt.sm, 'full-width q-mt-md': $q.screen.lt.md }">
      <q-btn outline square label="Cancelar" class="full-width q-mt-md" color="secondary"></q-btn>
    </div>
    <div class="col-12 col-md-6 q-mt-sm"
      :class="{ 'q-pl-sm q-pr-md': $q.screen.gt.sm, 'full-width q-mt-md': $q.screen.lt.md }">
      <q-btn type="submit" unelevated square label="Guardar" class="full-width q-mt-md" color="secondary"></q-btn>
    </div>
  </q-form>
</template>

<script lang="ts">
import { Utils } from 'src/utils/utils'
import { defineComponent, ref } from 'vue'
import { ResponseObj } from 'src/interfaces/api'
import { useBannersStore } from 'src/stores/banners'
import { notification } from 'src/boot/notification'
import FilePickerMotowork from '../../partials/filePickerMotowork.vue'
import { BannersInterface, TypeBanner } from 'src/interfaces/bannersInterface'

export default defineComponent({
  name: 'BannersFormComponent',
  components: {
    FilePickerMotowork
  },
  setup(props, { emit }) {
    // data
    const store = useBannersStore()
    const utils = new Utils('banners')
    const bannerTypeOptions = [
      {
        label: 'Inicio',
        value: TypeBanner.home
      },
      {
        label: 'Accesorios',
        value: TypeBanner.accesories
      },
      {
        label: 'Servicio técnico',
        value: TypeBanner.used
      },
      {
        label: 'Experiencias',
        value: TypeBanner.experencie
      },
      {
        label: 'Nosotros',
        value: TypeBanner.us
      }
    ]
    const banner = ref<BannersInterface>({
      name: '',
      link: '',
      type: TypeBanner.home,
      images: [],
      is_active: false
    })
    const tab = ref<string>('desktop')
    const tableBase64 = ref<string>('')
    const mobileBase64 = ref<string>('')
    const desktopBase64 = ref<string>('')
    const tableImage = ref<any>(null)
    const mobileImage = ref<any>(null)
    const desktopImage = ref<any>(null)

    // methods
    const doSaveBanners = async () => {
      if (!desktopImage.value || !tableImage.value || !mobileImage.value) {
        notification('warning', 'Faltan imagenes que agregar al banner', 'warning')
        return false
      }

      try {
        const formData = utils.transformObjectInFormData(banner.value, false, null)
        formData.append('images_tablet', tableImage.value ? tableImage.value : '')
        formData.append('images_mobile', mobileImage.value ? mobileImage.value : '')
        formData.append('images_desktop', desktopImage.value ? desktopImage.value : '')
        const response = await store.doSaveBanners(formData) as ResponseObj;
        if (response.success) {
          notification('success', response.message, 'success')
          banner.value = {
            name: '',
            link: '',
            type: TypeBanner.home,
            images: [],
            is_active: false
          }
          tableImage.value = null
          mobileImage.value = null
          desktopImage.value = null
          tableBase64.value = ''
          mobileBase64.value = ''
          desktopBase64.value = ''
          emit('close-modal')
        }
      } catch (error) {
      } finally {
      }
    }

    const setFile = (data: any) => {
      switch (data.type) {
        case "desktop":
          desktopImage.value = data.filePicker
          desktopBase64.value = data.base64
          break;

        case "tablet":
          tableImage.value = data.filePicker
          tableBase64.value = data.base64
          break;

        default:
          mobileImage.value = data.filePicker
          mobileBase64.value = data.base64
          break;
      }
    }

    return {
      tab,
      banner,
      setFile,
      tableBase64,
      mobileBase64,
      doSaveBanners,
      desktopBase64,
      bannerTypeOptions,
    }
  }
})
</script>
