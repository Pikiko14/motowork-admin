<template>
  <section class="file-selector">
    <div ref="filePickerRef" class="file-picker"
      :class="{ 'd-flex flex-row': maxFile >= 1 && !isBackgroundImage && arrayBase64.length > 0, 'large': fullHeight }" @click="openFilePicker"
      @dragover.prevent @drop="handleDrop">
      <q-img src="/images/upload.svg" width="60px" height="60px"></q-img>
      <span class="entity-file-picker" v-if="entity && arrayBase64.length === 0">
        {{ entity }}
      </span>
      <span class="title-file-picker" v-if="!base64Image && arrayBase64.length === 0">
        Arrastrar y soltar archivos o <span class="title-file-picker-span cursor-pointer">explorar</span>
      </span>
      <span v-if="!base64Image && arrayBase64.length === 0" class="title-file-picker-format">
        Formatos soportados: JPEG, PNG, GIF, MP4
      </span>
      <span class="title-file-picker-format" v-if="!base64Image && arrayBase64.length === 0">
        {{ resolutionLabel }}
      </span>
      <q-img class="brand-category-image" v-if="maxFile === 1 && !isBackgroundImage && base64Image"
        :src="base64Image"></q-img>
      <q-file accept="image/*" @update:model-value="(event) => setFile(event)" ref="fileInput" class="hidden"
        v-model="file"></q-file>
      </div>
      <div v-if="maxFile >= 1 && !isBackgroundImage && arrayBase64.length > 0" class="images-grid">
        <q-img :ratio="2/2" class="products-category-image" v-for="(base, idx) in arrayBase64" :key="idx" :src="base">
          <div class="absolute-full show-hover text-subtitle2 flex flex-center hidden">
            <q-btn @click="deleteFile(idx)" size="7pt" flat dense rounded icon="img:/images/trash.svg">
              <q-tooltip :offset="[10, 30]" class="bg-secondary">
                Eliminar archivo
              </q-tooltip>
            </q-btn>
          </div>
        </q-img>
      </div>
  </section>
</template>

<script lang="ts">
import { Utils } from 'src/utils/utils'
import { defineComponent, onBeforeMount, ref } from 'vue'
import { notification } from 'src/boot/notification'
import { FileObject } from 'src/interfaces/bannersInterface'

export default defineComponent({
  name: 'FilePickerComponents',
  props: {
    medias: {
      type: Array as () => any[],
      defualt: () => {
        return []
      },
    },
    maxFile: {
      type: Number,
      default: () => 1,
    },
    resolutionLabel: {
      type: String,
      default: () => 'Resolución mínima 505 X 614 Px',
    },
    type: {
      type: String,
      default: () => 'desktop',
    },
    base64Image: {
      type: String,
      default: () => '',
    },
    isBackgroundImage: {
      type: Boolean,
      default: () => true,
    },
    entity: {
      type: String,
      default: () => '',
    },
    arrayBase64: {
      type: Array as () => any[],
      default: () => [],
    },
    fullHeight: {
      type: Boolean,
      default: () => false
    }
  },
  emits: ['set-file', 'delete-file'],
  setup(props, { emit }) {
    // data
    const fileInput = ref()
    const filePickerRef = ref()
    const file = ref<any>(null)
    const { maxFile, type, isBackgroundImage, arrayBase64 } = props
    const filesBase64 = ref<any>([])
    const imageBase64 = ref<string>('')
    const utils = new Utils('filePicker')

    // methods
    const openFilePicker = () => {
      filesBase64.value = []
      fileInput.value.$el.click()
    }

    const handleDrop = (event: any) => {
      try {
        event.preventDefault()
        if (filesBase64.value.length === maxFile) {
          notification(
            '',
            `Solo puedes agregar ${maxFile} imágenes.`,
            'warning'
          )
          return false
        }
        const files = event.dataTransfer.files
        uploadFiles(files)
      } catch (error) { }
    }

    const uploadFiles = (files: FileObject[]) => {
      const maxSizeInBytes = 1024 * 1024
      for (let i = 0; i < files.length; i++) {
        const fileData = files[i]
        if (fileData.size > maxSizeInBytes) {
          file.value = null
          notification('', 'El archivo excede el tamaño maximo permitido (1MB).', 'warning')
          return false
        }
        if (fileData.type.startsWith('image/')) {
          file.value = file
          setFile(fileData)
          return true
        } else {
          notification('', 'El archivo debe ser tipo jpg, png, webp.', 'warning')
          return false
          // Aquí puedes mostrar un mensaje de error al usuario si es necesario
        }
      }
    }

    const setFile = (filePicker: FileObject) => {
      if (filesBase64.value.length === maxFile || arrayBase64.length === maxFile) {
        notification(
          '',
          `Solo puedes agregar ${maxFile} imágenes`,
          'warning'
        )
        return false
      }
      const maxSizeInBytes = 1024 * 1024
      const isValidFile = utils.valdiateFile(filePicker)
      // validate type file
      if (!isValidFile) {
        file.value = null
        notification('', 'El archivo debe ser tipo jpg, png, webp.', 'warning')
        return false
      }
      // validamos el tamaño del archivo
      if (filePicker.size > maxSizeInBytes) {
        file.value = null
        notification('', 'El archivo excede el tamaño maximo permitido (1MB).', 'warning')
        return false
      }
      if (filePicker.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (event: any) => {
          filesBase64.value.push({
            base64: event.target.result,
            key: filePicker.__key,
          })
          imageBase64.value = event.target.result
          const backgroundImage = `url('${event.target.result}')`
          if (isBackgroundImage && props.arrayBase64.length === 0) {
            setBackground(backgroundImage)
          }
          emitFile(filePicker)
        }
        reader.readAsDataURL(filePicker as any)
      }
    }

    const setBackground = (backgroundImage: string) => {
      filePickerRef.value.style.backgroundImage = backgroundImage
      filePickerRef.value.style.backgroundSize = 'cover'
      filePickerRef.value.style.backgroundPosition = 'center'
      filePickerRef.value.style.backgroundRepeat = 'no-repeat'
    }

    const emitFile = (filePicker: FileObject) => {
      emit('set-file', { type, filePicker, base64: imageBase64.value })
    }

    const deleteFile = (idx: number) => {
      emit('delete-file', idx);
    }

    // hook
    onBeforeMount(() => {
      setTimeout(() => {
        if (props.base64Image && props.arrayBase64.length === 0) {
          const backgroundImage = `url('${props.base64Image}')`
          setBackground(backgroundImage)
        }
      }, 100)
    })

    return {
      file,
      setFile,
      fileInput,
      filePickerRef,
      handleDrop,
      filesBase64,
      deleteFile,
      openFilePicker
    }
  }
})
</script>

<style lang="scss" scoped>
.images-grid {
  margin-top: -80px;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(70px, auto);
  gap: 10px;
  justify-content: center;
}

.products-category-image {
  width: 60px;
  max-height: 60px;
  border-radius: 8px;

  &:hover {
    .show-hover {
      display: flex !important;
    }
  }
}

.q-img__content  {
  display: flex;
  justify-content: center;
  align-items: center !important;
}

.large {
  height: 500px !important;

  @media(max-width: 767px) {
    height: 260px !important;
  }
}
</style>
