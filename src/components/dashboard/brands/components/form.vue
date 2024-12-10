<template>
  <q-form @submit="doSaveBrands" class="row banner-form">
    <div class="col-12 q-px-md q-mt-md">
      <label for="">Nombre de la marca<span class="text-secondary">*</span></label>
      <q-input square :rules="[
        val => (val && val.length > 0) || 'Por favor ingrese el nombre de la marca',
        val => (val && val.length >= 1) || 'Mayor a 1 caracteres',
        val => (val && val.length <= 90) || 'Menor a 90 caracteres',
        val => /^[a-zA-Z0-9 áéíóúÁÉÍÓÚñÑüÜ]+$/.test(val) || 'Solo letras y números'
      ]" placeholder="Ingresa un nombre" outlined dense v-model="brand.name"></q-input>
    </div>
    <div class="col-12 q-px-md q-mt-sm">
      <label for="">Tipo de marca <span class="text-secondary">*</span></label>
      <q-select square emit-value map-options :rules="[(val) => !!val || 'Selecciona una opción']" outlined dense
        v-model="brand.type" :options="brandTypeOptions"></q-select>
    </div>
    <div class="col-12 q-px-md q-mt-sm">
      <FilePickerMotowork :isBackgroundImage="false" :maxFile="1" :base64Image="base64Img"
        resolutionLabel="Resolución mínima 505 X 614 Px" :type="'desktop'" @set-file="setFile" />
    </div>
    <div class="col-12 col-md-6 q-mt-sm"
      :class="{ 'q-pl-md q-pr-md': $q.screen.gt.sm, 'full-width q-mt-md': $q.screen.lt.md }">
      <q-btn :loading="loading" type="submit" unelevated square label="Guardar"
        class="full-width q-mt-md btn-cancel-solid"></q-btn>
    </div>
    <div class="col-12 col-md-6 q-mt-sm"
      :class="{ 'q-pr-md q-pl-md': $q.screen.gt.sm, 'full-width q-mt-md': $q.screen.lt.md }">
      <q-btn v-close-popup outline square label="Cancelar" class="full-width q-mt-md btn-cancel"></q-btn>
    </div>
  </q-form>
</template>

<script lang="ts">
import { Utils } from 'src/utils/utils'
import { defineComponent, onBeforeMount, ref } from 'vue'
import { ResponseObj } from 'src/interfaces/api'
import { useBrandsStore } from 'src/stores/brands'
import FilePickerMotowork from '../../partials/filePickerMotowork.vue'
import { BrandsInterface, Typebrand } from 'src/interfaces/brands.interface'
import { notification } from 'src/boot/notification'

export default defineComponent({
  name: 'BrandsFormComponents',
  components: {
    FilePickerMotowork
  },
  props: {
    brand: {
      type: Object as () => BrandsInterface,
      default: () => ({
        icon: '',
        name: '',
        type: Typebrand.vehicle
      })
    }
  },
  emits: ['close-modal'],
  setup(props, { emit }) {
    // data
    const brandTypeOptions = [
      {
        label: 'Vehículos',
        value: Typebrand.vehicle
      },
      {
        label: 'Productos',
        value: Typebrand.product
      }
    ]
    const file = ref<any>(null)
    const base64Img = ref<string>('')
    const store = useBrandsStore()
    const utils = new Utils('brands')
    const loading = ref<boolean>(false)
    const brand = ref<BrandsInterface>({
      icon: '',
      name: '',
      type: Typebrand.vehicle
    })

    // methods
    const doSaveBrands = async (): Promise<boolean | void> => {
      try {
        // set form data
        const formData = utils.transformObjectInFormData(brand.value, false, null)

        // set file in form data
        if (file.value) {
          formData.append('file', file.value ? file.value : '')
        }

        // send request
        loading.value = true

        // validate
        if (brand.value._id) {
          await doUpdateBrands(brand.value._id, formData)
          return true;
        }
        alert(123)

        const response = await store.doSaveBrands(formData) as ResponseObj
        if (response.success) {
          notification('positive', response.message, 'success')
          brand.value = {
            icon: '',
            name: '',
            type: Typebrand.vehicle
          }
          file.value = null
          base64Img.value = ''
          emit('close-modal')
        }
      } catch (error) {
      } finally {
        loading.value = false
      }
    }

    const doUpdateBrands = async (id: string, formData: FormData): Promise<boolean | void> => {
      try {
        const response = await store.doUpdateBrands(id, formData) as ResponseObj
        if (response.success) {
          notification('positive', response.message, 'success')
          brand.value = {
            icon: '',
            name: '',
            type: Typebrand.vehicle
          }
          file.value = null
          base64Img.value = ''
          emit('close-modal')
        }
      } catch (error) {
      } finally {
        loading.value = false
      }
    }

    const setFile = (data: any) => {
      file.value = data.filePicker
      base64Img.value = data.base64
    }

    // hook
    onBeforeMount(() => {
      if (props.brand && props.brand._id) {
        brand.value = JSON.parse(JSON.stringify(props.brand))
      }
    })

    return {
      setFile,
      loading,
      brand,
      base64Img,
      doSaveBrands,
      brandTypeOptions,
    }
  }
})
</script>
