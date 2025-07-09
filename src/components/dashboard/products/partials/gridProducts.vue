<template>
  <section class="product-list full-width" v-if="products && products.length > 0">
    <div class="products-grid">
      <article class="product-item" :class="{ 'item-white': idx % 2 === 0, 'item-gray': idx % 2 !== 0 }"
        v-for="(product, idx) in products" :key="idx" @click="$router.push({ name: 'productShow', params: { id: product._id } })">
        <!--Image-->
        <div class="product-item-img">
          <img
            :src="product?.banner ? getBannerUrl(idx) : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930'"
            class="product-img">
          </img>

          <div class="chip" :class="{ 'news': product.state === 'Nueva', 'used': product.state === 'Usada' }">
            {{ product.state }}
          </div>
        </div>
        <!--End image-->

        <!--Product title-->
        <p class="product-title">
          <q-img :src="product.brand_icon" v-if="product.brand_icon"></q-img>
          {{ product.name }}
        </p>
        <!--End product title-->

        <!--category-->
        <div class="category">
          <p>{{ product.category }}</p>
        </div>
        <!--End category-->

        <!--price-->
        <div class="price">
          <p v-if="product.discount" class="text-secondary">{{ utils.formatPrice(product.discount as number) }}</p>
          <p :class="{ 'price-with-discount': product.discount }">{{ utils.formatPrice(product.price as number) }}</p>
        </div>
        <!--End price-->
      </article>
    </div>

    <!--Paginator section-->
    <div class="full-width q-mt-lg d-flex space-between" v-if="totalPages > 0">
      <q-pagination
        :max-pages="6"
        direction-links
        icon-prev="<"
        icon-next=">"
        @update:model-value="doPagination"
        color="secondary"
        v-model="currentPage"
        :max="totalPages"
      />
      <div>
        <q-btn :disabled="currentPage === 1" flat dense icon="img:/images/left.png" @click="doPreviewPage"></q-btn>
        <q-btn :disabled="currentPage === totalPages" flat dense icon="img:/images/right.png"
          @click="doNextPage"></q-btn>
      </div>
    </div>
    <!--End Paginator section-->
  </section>
</template>

<script lang="ts" setup>
import { Utils } from '../../../../utils/utils'
import { useRoute, useRouter } from 'vue-router'
import { defineProps, onBeforeMount, ref } from 'vue'
import { ProductsBanners } from '@/interfaces/productsInterface';
import { ProductsInterface } from '@/interfaces/productsInterface'

const props = defineProps({
  products: {
    type: Array as () => ProductsInterface[],
    required: true
  },
  totalPages: {
    type: Number,
    default: 0
  }
})

// references

const route = useRoute()
const router = useRouter()
const utils = new Utils('products');
const currentPage = ref<number>(1)

// methods
const doPagination = (page: number): void => {
  currentPage.value = page
  const search = route.query.search ? route.query.search as string : ''
  const perPage = route.query.perPage ? parseInt(route.query.perPage as string) : 10
  const type = route.query.type ? route.query.type as string : ''
  const sortBy = route.query.sortBy ? route.query.sortBy as string : ''
  const order = route.query.order ? route.query.order as string : ''
  const filter = route.query.filter || ''
  const { path } = route
  router.push({ path: path, query: { page, perPage, search, type, sortBy, order, filter } })
}

const doPreviewPage = (): void => {
  if (currentPage.value > 1) {
    currentPage.value--
    doPagination(currentPage.value)
  }
}

const doNextPage = (): void => {
  if (currentPage.value < props.totalPages) {
    currentPage.value++
    doPagination(currentPage.value)
  }
}

const getBannerUrl = (idx: number): string => {
  const { banner } = props.products[idx];
  let url = 'https://s3.amazonaws.com/roypi.com/static/images/default_product.png';
  const mobileBanner = banner.find((banner: ProductsBanners) => banner.type_banner === 'mobile')
  if (mobileBanner) {
    url = mobileBanner.path
  } else {
    const desktopBanner = banner.find((banner: ProductsBanners) => banner.type_banner === 'desktop')
    if (desktopBanner) {
      url = desktopBanner.path
    }
  }
  return url;
}

// hook
onBeforeMount(() => {
  currentPage.value = route.query.page ? parseInt(route.query.page as string) : 1
})
</script>

<style lang="scss" scoped>
.products-grid {
  display: grid;
  widows: 100%;
  grid-template-columns: repeat(5, 1fr);
  /* 5 columnas */
  gap: 16px;
  /* Espaciado entre elementos */

  @media(min-width: 1921px) {
    grid-template-columns: repeat(6, 1fr);
  }

  @media(min-width: 2200px) {
    grid-template-columns: repeat(6, 1fr);
  }

  @media(min-width: 2400px) {
    grid-template-columns: repeat(8, 1fr);
  }

  @media(min-width: 2600px) {
    grid-template-columns: repeat(10, 1fr);
  }
}

.product-item {
  padding: 8px;
  display: flex;
  width: 100%;
  padding: 8px;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 12px;
  cursor: pointer;

  .product-img {
    width: 100%;
    object-fit: fill;
    height: 160px;
    border-radius: 8px;
    position: relative;

    @media(max-width: 1400px) {
      height: 120px;
    }

    @media(max-width: 600px) {
      height: 155px;
    }
  }

  .product-item-img {
    position: relative;
    width: 100%;
  }

  .chip {
    position: absolute;
    top: 8px;
    right: 8px;
  }

  .product-title {
    margin-top: 8px;
    color: #000;
    font-family: Play;
    font-size: 12pt;
    font-style: normal;
    font-weight: 700;
    line-height: 125%;
    /* 15px */
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 8px;

    .q-img {
      width: 16px;
      height: 16px;
    }
  }

  .category {
    margin-top: 12px;
    display: flex;
    padding: 4px 12px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    background: #F5F5F5;
    color: #898384;
    text-align: center;

    /* Mobile/Body/Title/Small */
    font-family: Play;
    font-size: 10pt;
    font-style: normal;
    font-weight: 700;
    line-height: 125%;
    /* 12.5px */
    text-transform: uppercase;
  }

  .price {
    display: flex;
    gap: 8px;
    margin-top: 12px;
    margin-bottom: 8px;
    color: #000;
    font-family: Ubuntu;
    font-size: 12pt;
    font-style: normal;
    font-weight: 400;
    line-height: 125%;
    /* 15px */
  }
}

/* Responsividad */
@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
    /* 4 columnas */
  }
}

@media (max-width: 992px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    /* 3 columnas */
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    /* 2 columnas */
  }
}

@media (max-width: 576px) {
  .products-grid {
    grid-template-columns: 1fr;
    /* 1 columna */
  }
}

.item-white {
  border: 1px solid #F5F5F5;
  background: #fff;
}

.item-gray {
  border: 1px solid #F5F5F5;
  background: #F5F5F5;
}

.price-with-discount {
  color: #CCCBCB;
  text-decoration: line-through !important;
}
</style>
