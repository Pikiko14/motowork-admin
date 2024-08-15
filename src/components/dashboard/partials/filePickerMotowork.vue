<template>
  <section ref="filePickerRef" class="file-picker" @click="openFilePicker" @dragover.prevent @drop="handleDrop">
    <q-img src="/images/upload.svg" width="60px" height="60px"></q-img>
    <span class="title-file-picker" v-if="!base64Image">
      Arrastrar y soltar archivos o <span class="title-file-picker-span cursor-pointer">explorar</span>
    </span>
    <span v-if="!base64Image" class="title-file-picker-format">
      Formatos soportados: JPEG, PNG, GIF, MP4
    </span>
    <span class="title-file-picker-format" v-if="!base64Image">
      {{ resolutionLabel }}
    </span>
    <q-file accept="image/*" @update:model-value="(event) => setFile(event)" ref="fileInput" class="hidden"
      v-model="file"></q-file>
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
    }
  },
  emits: ['set-file'],
  setup(props, { emit }) {
    // data
    const fileInput = ref()
    const filePickerRef = ref()
    const file = ref<any>(null)
    const { maxFile, type } = props
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
            'negative',
            'Solo puedes agregar una imágen.',
            'red'
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
          notification('negative', 'El archivo excede el tamaño maximo permitido (1MB).', 'red')
          return false
        }
        if (fileData.type.startsWith('image/')) {
          file.value = file
          setFile(fileData)
          return true
        } else {
          notification('negative', 'El archivo debe ser tipo jpg, png, webp.', 'red')
          return false
          // Aquí puedes mostrar un mensaje de error al usuario si es necesario
        }
      }
    }

    const setFile = (filePicker: FileObject) => {
      if (filesBase64.value.length === maxFile) {
        notification(
          'negative',
          'Solo puedes agregar una imágen',
          'red'
        )
        return false
      }
      const maxSizeInBytes = 1024 * 1024
      console.log(filePicker)
      const isValidFile = utils.valdiateFile(filePicker)
      // validate type file
      if (!isValidFile) {
        file.value = null
        notification('negative', 'El archivo debe ser tipo jpg, png, webp.', 'red')
        return false
      }
      // validamos el tamaño del archivo
      if (filePicker.size > maxSizeInBytes) {
        file.value = null
        notification('negative', 'El archivo excede el tamaño maximo permitido (1MB).', 'red')
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
          setBackground(backgroundImage)
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

    // hook
    onBeforeMount(() => {
      setTimeout(() => {
        if (props.base64Image) {
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
      openFilePicker
    }
  }
})
</script>
