<template>
  <q-form @submit="doSaveCategories" class="row banner-form">
    <div class="col-12 q-px-md q-mt-md">
      <label for="">Nombre <span class="text-secondary">*</span></label>
      <q-input square :rules="[
        val => (val && val.length > 0) || 'Por favor ingrese el nombre de la categoría',
        val => (val && val.length >= 1) || 'Mayor a 1 caracteres',
        val => (val && val.length <= 90) || 'Menor a 90 caracteres',
        val => /^[a-zA-Z0-9 ]+$/.test(val) || 'Solo letras y números'
      ]" placeholder="Ingresa un nombre" outlined dense v-model="category.name"></q-input>
    </div>
    <div class="col-12 q-px-md q-mt-sm">
      <label for="">Tipo de categoría <span class="text-secondary">*</span></label>
      <q-select square emit-value map-options :rules="[(val) => !!val || 'Selecciona una opción']" outlined dense
        v-model="category.type" :options="categoryTypeOptions"></q-select>
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
import { useCategoriesStore } from 'src/stores/category'
import FilePickerMotowork from '../../partials/filePickerMotowork.vue'
import { CategoriesInterface, TypeCategory } from 'src/interfaces/categories.interface'
import { notification } from 'src/boot/notification'

export default defineComponent({
  name: 'CategoriesFormComponents',
  components: {
    FilePickerMotowork
  },
  props: {
    category: {
      type: Object as () => CategoriesInterface,
      default: () => ({
        icon: '',
        name: '',
        type: TypeCategory.vehicle
      })
    }
  },
  emits: ['close-modal'],
  setup(props, { emit }) {
    // data
    const categoryTypeOptions = [
      {
        label: 'Vehículos',
        value: TypeCategory.vehicle
      },
      {
        label: 'Productos',
        value: TypeCategory.product
      }
    ]
    const file = ref<any>(null)
    const base64Img = ref<string>('')
    const store = useCategoriesStore()
    const utils = new Utils('category')
    const loading = ref<boolean>(false)
    const category = ref<CategoriesInterface>({
      icon: '',
      name: '',
      type: TypeCategory.vehicle
    })

    // methods
    const doSaveCategories = async (): Promise<boolean | void> => {
      try {
        // set form data
        const formData = utils.transformObjectInFormData(category.value, false, null)

        // set file in form data
        if (file.value) {
          formData.append('file', file.value ? file.value : '')
        }

        // send request
        loading.value = true

        // validate
        if (category.value._id) {
          await doUpdateCategories(category.value._id, formData)
          return true;
        }

        const response = await store.doSaveCategories(formData) as ResponseObj
        if (response.success) {
          notification('success', response.message, 'success')
          category.value = {
            icon: '',
            name: '',
            type: TypeCategory.vehicle
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

    const doUpdateCategories = async (id: string, formData: FormData): Promise<boolean | void> => {
      try {
        const response = await store.doUpdateCategories(id, formData) as ResponseObj
        if (response.success) {
          notification('success', response.message, 'success')
          category.value = {
            icon: '',
            name: '',
            type: TypeCategory.vehicle
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
      if (props.category && props.category._id) {
        category.value = JSON.parse(JSON.stringify(props.category))
      }
    })

    return {
      setFile,
      loading,
      category,
      base64Img,
      doSaveCategories,
      categoryTypeOptions,
    }
  }
})
</script>
