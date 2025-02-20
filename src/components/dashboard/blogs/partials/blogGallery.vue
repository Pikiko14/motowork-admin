<template>
  <div class="blog-gallery">
    <!--Banner image-->
    <q-img v-if="getBannerImage" class="blog-gallery__banner" :src="getBannerImage ? getBannerImage.path : ''">
      <div>
        <q-btn v-if="getBannerImage" unelevated flat dense class="relative" color="secondary" icon="img:/images/trash.svg" @click="deleteImage(getBannerImage)"></q-btn>
      </div>
    </q-img>
    <!--End banner image-->

    <div class="blog-gallery__carousel q-mt-lg">
      <q-scroll-area style="width: 100%; height: 180px">
        <div class="row no-wrap">
          <div class="grid-scroll">
            <q-img class="grid-scroll__item"
              v-for="(img, idx) in restImages" :key="idx" :src="img.path">
              <div>
                <q-btn v-if="getBannerImage" unelevated flat dense class="relative" color="secondary" icon="img:/images/trash.svg" @click="deleteImage(img)"></q-btn>
              </div>
            </q-img>
          </div>
        </div>
      </q-scroll-area>
    </div>
  </div>
</template>

<script lang="ts" setup>
// imports
import { useQuasar } from 'quasar'
import { computed, defineProps, ref, defineEmits } from 'vue'
import { BlogsImagesInterface } from '@/interfaces/blogs.interface'

// references
const q = useQuasar()

// emit
const emit = defineEmits(['do-delete-img'])

// props
const props = defineProps({
  images: {
    type: Array as () => BlogsImagesInterface[],
    defualt: () => []
  }
})

// computed
const getBannerImage = computed(() => {
  if (props.images) {
    return props.images[0] as any
  }
  return {}
})

const restImages = computed(() => {
  if (props.images) {
    const images = JSON.parse(JSON.stringify(props.images))
    images.splice(0, 1)
    return images
  }
  return []
})

const deleteImage = (item: BlogsImagesInterface) => {
  q.dialog({
    title: 'Eliminar',
    message: '¿Deseas eliminar esta imagen?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    emit('do-delete-img', item, 'image')
  })
}
</script>

<style lang="scss" scoped>
.blog-gallery {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;

  &__banner {
    width: 100%;
    min-height: 388px;
    object-fit: cover;
  }

  &__carousel {
    .q-carousel {
      height: 280px;
    }

    &--image {
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;
    }
  }
}

.grid-scroll {
  display: flex;
  flex-direction: row;
  gap: 16px;

  &__item {
    height: 150px;
    width: 200px;
  }
}
</style>
