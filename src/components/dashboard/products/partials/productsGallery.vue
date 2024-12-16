<template>
  <div class="product-gallery">
    <!--Banner image-->
    <q-img class="product-gallery__banner" :src="getBannerByTab"></q-img>
    <!--End banner image-->

    <div class="product-gallery__carousel">
      <q-carousel
        animated
        v-model="slide"
        autoplay
        infinite
      >
      <q-carousel-slide v-for="(img, idx) in slideCarousel" :key="idx" class="product-gallery__carousel--image" :name="idx" :img-src="img.path" />
      </q-carousel>
    </div>
  </div>
</template>

<script lang="ts" setup>
// imports
import { computed, defineProps, ref } from 'vue'
import { ProductImagesInterface, ProductsBanners } from '@/interfaces/productsInterface'

// props
const props = defineProps({
  images: {
    type: Array as () => ProductImagesInterface[],
    defualt: () => []
  },
  banners: {
    type: Array as () => ProductsBanners[],
    defualt: () => []
  },
  tab: {
    type: String,
    default: 'desktop'
  }
})

// references
const slide = ref(1)

// computed
const getBannerByTab = computed(() => {
  let bannerUrl: string | undefined = ''
  if (props.banners) {
    const banner = props.banners.find((item: ProductsBanners) => item.type_banner === props.tab)
    bannerUrl = banner?.path
  }
  return bannerUrl
})

const slideCarousel = computed(() => {
  let images: ProductImagesInterface[] | any = []
  if (props.images) {
    images = props.images.filter((item: ProductImagesInterface) => item.type === props.tab)
  }
  return images
})
</script>

<style lang="scss" scoped>
.product-gallery {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;

  &__banner {
    width: 100%;
    max-height: 250px;
  }

  &__carousel {
    .q-carousel {
      height: 280px;
    }
  }
}
</style>
