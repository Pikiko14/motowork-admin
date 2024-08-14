<template>
  <div class="row full-width main-header">
    <div class="col-12 col-md-4">
      <div class="user-welcome-title full-width q-pb-sm">
        {{ title }}
      </div>
    </div>
    <div class="col-12 col-md-8">
      <div class="row full-width justify-end">
        <div class="col-12 col-md-6">
          <q-input clearable debounce="1000" @update:model-value="doSearch" placeholder="Buscar" color="dark-page"
            class="input-search" v-model="search" dense>
            <template v-slot:append>
              <q-icon size="16pt" class="q-mr-md" name="img:/images/search.svg" />
            </template>
          </q-input>
        </div>
        <div v-if="showAddButton" class="col-12 col-md-2 text-right"
          :class="{ 'q-px-lg': $q.screen.gt.sm, 'full-width q-mt-md': $q.screen.lt.md }">
          <q-btn @click="doOpenModal" square color="secondary" class="full-width" label="Añadir" unelevated></q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { defineComponent, onBeforeMount, ref } from 'vue'

export default defineComponent({
  name: 'HeadersMotoworkComponent',
  props: {
    title: {
      type: String,
      default: ''
    },
    showAddButton: {
      type: Boolean,
      default: true
    }
  },
  emits: ['open-modal'],
  setup(props, { emit }) {
    // data
    const route = useRoute()
    const router = useRouter()
    const search = ref<string>('')

    // methods
    const doSearch = (searchString: string | number | null) => {
      router.push({
        name: 'banners',
        query: {
          page: 1,
          perPage: 12,
          search: searchString
        }
      })
    }

    const doOpenModal = () => {
      emit('open-modal')
    }

    // hook
    onBeforeMount(() => {
      search.value = route.query.search ? route.query.search as string : ''
    })


    return {
      search,
      doSearch,
      doOpenModal
    }
  }
})
</script>

<style lang="css" scoped></style>
