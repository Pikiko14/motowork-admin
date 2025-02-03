<template>
  <section class="blog-list full-width" v-if="blogs && blogs.length > 0">
    <div class="blogs-grid">
      <article class="blog-item item-gray" v-for="(blog, idx) in blogs" :key="idx"
        @click="$router.push({ name: 'blogShow', params: { id: blog._id } })">
        <!--Image-->
        <img
          class="blog-img"
          :src="blog?.images ? getImage(blog) : ''">
        </img>
        <!--end image-->

        <!--Blog title-->
        <p class="blog-title">
          {{ blog.title }}
        </p>
        <!--End Blog title-->

        <!--Blog description-->
        <p class="blog-description ellipsis-3-lines">
          {{ blog.description }}
        </p>
        <!--End Blog title-->

        <!--Blog description-->
        <div class="row full-width">
          <div class="col-8">
            <p class="blog-category">
              {{ blog.category }} / {{ blog.subcategory }}
            </p>
          </div>
          <div class="col-4">
            <p class="blog-description ">
              {{ utils.formatDate(blog.createdAt) }}
            </p>
          </div>
        </div>
        <!--End Blog title-->
      </article>
    </div>

    <!--Paginator section-->
    <div class="full-width q-mt-lg d-flex space-between" v-if="totalPages > 0">
      <q-pagination @update:model-value="doPagination" color="secondary" v-model="currentPage" :max="totalPages" />
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
import { BlogsInterface } from '@/interfaces/blogs.interface'

const props = defineProps({
  blogs: {
    type: Array as () => BlogsInterface[],
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
const utils = new Utils('blogs');
const currentPage = ref<number>(1)

// methods
const doPagination = (page: number): void => {
  currentPage.value = page
  const search = route.query.search ? route.query.search as string : ''
  const perPage = route.query.perPage ? parseInt(route.query.perPage as string) : 10
  const sortBy = route.query.sortBy ? route.query.sortBy as string : ''
  const order = route.query.order ? route.query.order as string : ''
  const filter = route.query.filter || ''
  const { path } = route
  router.push({ path: path, query: { page, perPage, search, sortBy, order, filter } })
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

const getImage = (blog: BlogsInterface) => {
  if (blog.images && blog.images.length > 0) {
    return blog.images[0].path
  }
  return 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930'
}

// hook
onBeforeMount(() => {
  currentPage.value = route.query.page ? parseInt(route.query.page as string) : 1
})
</script>

<style lang="scss" scoped>
.blogs-grid {
  display: grid;
  widows: 100%;
  grid-template-columns: repeat(4, 1fr);
  /* 5 columnas */
  gap: 16px;
  /* Espaciado entre elementos */

  @media(min-width: 1920px) {
    grid-template-columns: repeat(8, 1fr);

  }

  @media(min-width: 1620px) {
    grid-template-columns: repeat(6, 1fr);

  }
}

.blog-item {
  padding: 8px;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 12px;
  cursor: pointer;
  gap: 16px;

  .blog-img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
    position: relative;
  }

  .blog-title {
    color: #000;
    font-family: Play;
    font-size: 14pt;
    font-style: normal;
    font-weight: 700;
    line-height: 125%;
    /* 15px */
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .blog-description {
    overflow: hidden;
    color: #9F9C9C;
    font-family: Ubuntu;
    font-size: 12pt;
    font-style: normal;
    font-weight: 400;
    line-height: 125%; /* 15px */
  }

  .blog-category {
    color: #ED1C24;

    /* Mobile/Body/Title/Small */
    font-family: Play;
    font-size: 12pt;
    font-style: normal;
    font-weight: 400;
    line-height: 125%;
    /* 12.5px */
    text-transform: capitalize;
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
@media (max-width: 1199px) {
  .blogs-grid {
    grid-template-columns: repeat(3, 1fr);
    /* 4 columnas */
  }
}

@media (max-width: 992px) {
  .blogs-grid {
    grid-template-columns: repeat(3, 1fr);
    /* 3 columnas */
  }
}

@media (max-width: 768px) {
  .blogs-grid {
    grid-template-columns: repeat(2, 1fr);
    /* 2 columnas */
  }
}

@media (max-width: 576px) {
  .blogs-grid {
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
