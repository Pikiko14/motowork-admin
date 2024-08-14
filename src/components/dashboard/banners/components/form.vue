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
  </q-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { FileObject } from 'src/interfaces/bannersInterface'
import FilePickerMotowork from '../../partials/filePickerMotowork.vue'

export default defineComponent({
  name: 'BannersFormComponent',
  components: {
    FilePickerMotowork
  },
  setup() {
    // data
    const tab = ref<string>('desktop')
    const tableBase64 = ref<string>('')
    const mobileBase64 = ref<string>('')
    const desktopBase64 = ref<string>('')
    const tableImage = ref<FileObject>({} as FileObject)
    const mobileImage = ref<FileObject>({} as FileObject)
    const desktopImage = ref<FileObject>({} as FileObject)

    // methods
    const doSaveBanners = () => { }

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
      setFile,
      tableBase64,
      mobileBase64,
      doSaveBanners,
      desktopBase64,
    }
  }
})
</script>
