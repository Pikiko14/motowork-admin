<template>
  <div class="row q-py-md q-my-xs">
    <!--Header-->
    <div class="col-12">
      <HeadersMotowork
        :orderMenu="orderMenu"
        :filterItems="filterMenu"
        :show-order-button="true"
        @do-order="doOrder"
        :title="'Experiencias'"
        @do-filter="doFilter"
        @open-modal="pushRouter('createBlogs')" />
    </div>
    <!--End header-->

    <!--entries-->
    <div class="col-12 q-mt-lg" :class="{ 'q-pr-lg': $q.screen.gt.sm }">
      <GridEntries :blogs="blogs" :totalPages="totalPages" />
    </div>
    <!--end entries-->
  </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onBeforeMount, computed } from 'vue'
import { useBlogsStore } from '../../../stores/blog'
import GridEntries from './partials/gridEntries.vue';
import { SortGroup, SortOption } from '@/interfaces/api'
import HeadersMotowork from '../partials/headersMotowork.vue'

// references
const route = useRoute()
const router = useRouter()
const orderMenu = ref<SortGroup[]>([
  {
    label: 'Alfabeticamente',
    items: [
      {
        label: 'De la A - Z',
        value: '1',
        by: 'title',
      },
      {
        label: 'De la Z- A',
        value: '-1',
        by: 'title',
      },
    ]
  },
  {
    label: 'Creación',
    items: [
      {
        label: 'Agregados recientemente',
        value: '-1',
        by: 'createdAt',
      },
      {
        label: 'Agregados anteriormente',
        value: '1',
        by: 'createdAt',
      },
    ]
  },
])
const filterMenu = ref([
  {
    label: 'ESTADO',
    value: [],
    items: [
      {
        label: 'Activos',
        value: true,
        key: 'active'
      },
      {
        label: 'Inactivos',
        value: false,
        key: 'active'
      }
    ]
  }
])
const store = useBlogsStore()

// computed
const blogs = computed(() => {
  return store.blogs
})

const totalPages = computed(() => {
  return store.totalPages
})

// methods
const doOrder = (item: SortOption): void => {
  const page = 1
  const perPage = route.query.perPage || 7
  const search = route.query.search || ''
  const sortBy = item.by
  const order = item.value
  const filter = route.query.filter || ''

  router.push({
    name: 'blogs',
    query: {
      page,
      perPage,
      search,
      sortBy,
      order,
      filter
    }
  })
}

const doFilter = (item: any) => {
  const page = 1;
  const perPage = route.query.perPage || 7
  const search = route.query.search || ''
  const sortBy = route.query.sortBy || 'name'
  const order = route.query.order || '1'
  const filter: any = {
    [item.key]: item.value
  }

  router.push({
    name: 'blogs',
    query: {
      page,
      perPage,
      search,
      sortBy,
      order,
      filter: JSON.stringify(filter)
    }
  })
}

const pushRouter = (routeName: string) => {
  router.push({
    name: routeName,
  });
};

const listBlogs = async (): Promise<void> => {
  try {
    const page = route.query.page || 1
    const perPage = route.query.perPage || 7
    const search = route.query.search || ''
    const sortBy = route.query.sortBy || 'title'
    const order = route.query.order || 'asc'
    const filter = route.query.filter || ''
    const query = `?page=${page}&perPage=${perPage}&search=${search}&sortBy=${sortBy}&order=${order}&filter=${filter}&fields=title,description,category,subcategory,createdAt,images`
    await store.doListBlogs(query)
  } catch (error) {
  }
}

// hooks
onBeforeMount(async () => {
  await listBlogs()
})
</script>
