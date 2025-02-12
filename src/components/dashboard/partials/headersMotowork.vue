<template>
  <div class="row full-width main-header">
    <div class="col-12 col-md-4">
      <div class="user-welcome-title full-width q-pb-sm">
        {{ title }}
      </div>
    </div>
    <div class="col-12 col-md-8">
      <div class="row full-width justify-end">
        <div class="col-12 col-md-1 q-pt-sm" v-if="showCalendar">
          <q-btn :class="{ 'full-width q-mb-md': q.screen.lt.md }" class="text-black" color="primary" icon="img:/images/calendar.svg"
            unelevated>
            <q-popup-proxy cover class="date-proxy" transition-show="scale" transition-hide="scale">
              <q-date @update:model-value="handlerFilterByDate" v-model="dateModel" :range="true">
              </q-date>
            </q-popup-proxy>
          </q-btn>
        </div>
        <div class="col-12 col-md-1 q-pt-sm" v-if="showOrderButton">
          <q-btn :class="{ 'full-width q-mb-md': q.screen.lt.md }" color="secondary" icon="img:/images/order_icon.svg"
            unelevated>
            <q-menu>
              <q-list class="menu-list">
                <q-item-label header>
                  <span class="sort-title">Odenar</span>
                </q-item-label>
                <q-item v-for="(item, idx) in orderMenu" :key="idx">
                  <q-item-section>
                    <q-item-label>
                      <span class="sort-item-label">
                        {{ item.label }}
                      </span>
                      <div class="list-subitems cursor-pointer">
                        <div class="list-subitem-label" v-close-popup @click="handleDoOrder(subitem)"
                          v-for="(subitem, idx2) in item.items" :key="idx2">
                          {{ subitem.label }}
                        </div>
                      </div>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
        <div class="col-12 col-md-1 q-pt-sm" v-if="filterItems.length > 0">
          <q-btn :class="{ 'full-width q-mb-md': q.screen.lt.md }" color="primary" icon="img:/images/filter.svg"
            unelevated>
            <q-menu>
              <q-list class="menu-list">
                <q-item-label header>
                  <span class="sort-title">Filtro</span>
                </q-item-label>
                <q-item v-for="(item, idx) in filterItems" :key="idx">
                  <q-item-section>
                    <q-item-label>
                      <span class="sort-item-label">
                        {{ item.label }}
                      </span>
                      <div class="list-subitems cursor-pointer">
                        <div class="list-subitem-label" v-close-popup @click="handleDoFilter(subitem)"
                          v-for="(subitem, idx2) in item.items" :key="idx2">
                          {{ subitem.label }}
                        </div>
                      </div>
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="route.query.filter">
                  <q-item-section>
                    <q-item-label>
                      <q-btn @click="clearFilter" color="secondary" label="Limpiar filtro" unelevated></q-btn>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
        <div class=" col-12 col-md-6">
          <q-input clearable debounce="1000" @update:model-value="doSearch" placeholder="Buscar" color="dark-page"
            class="input-search" v-model="search" dense>
            <template v-slot:append>
              <q-icon size="16pt" class="q-mr-md" name="img:/images/search.svg" />
            </template>
          </q-input>
        </div>
        <div v-if="showAddButton" class="col-12 col-md-2 q-pt-sm text-right"
          :class="{ 'q-px-lg': q.screen.gt.sm, 'full-width q-mt-md': q.screen.lt.md }">
          <q-btn @click="doOpenModal" square color="secondary" class="full-width" label="Añadir" unelevated></q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { date } from 'quasar'
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router'
import { defineComponent, onBeforeMount, ref } from 'vue'
import { SortGroup, SortOption } from 'src/interfaces/api';

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
    },
    showOrderButton: {
      type: Boolean,
      default: false
    },
    orderMenu: {
      type: Array as () => SortGroup[],
      default: () => []
    },
    filterItems: {
      type: Array as () => any[],
      default: () => []
    },
    showCalendar: {
      type: Boolean,
      default: () => false
    }
  },
  emits: [
    'open-modal',
    'do-order',
    'do-filter'
  ],
  setup(props, { emit }) {
    // data
    const now = new Date()
    const q = useQuasar()
    const route = useRoute()
    const router = useRouter()
    const search = ref<string>('')
    const dateModel = ref(date.formatDate(now, 'dd-mm-yyyy'))

    // methods
    const doSearch = (searchString: string | number | null) => {
      const type = route.query.type ? route.query.type as string : ''
      const sortBy = route.query.sortBy ? route.query.sortBy as string : ''
      const order = route.query.order ? route.query.order as string : ''
      const { path } = route
      router.push({
        path: path,
        query: {
          page: 1,
          perPage: route.path === '/dashboard/orders' ? 7 : 10,
          search: searchString,
          type,
          sortBy,
          order
        }
      })
    }

    const doOpenModal = () => {
      emit('open-modal')
    }

    const handleDoOrder = (item: SortOption): void => {
      emit('do-order', item)
    }

    const handleDoFilter = (item: any) => {
      emit('do-filter', item)
    }

    const clearFilter = () => {
      const type = route.query.type ? route.query.type as string : ''
      const { path } = route
      router.push({
        path: path,
        query: {
          page: 1,
          perPage: 10,
          search: '',
          sortBy: route.query.sortBy || 'name',
          order: '1',
          type,
        }
      })
    }

    const handlerFilterByDate = (e: any) => {
      const type = route.query.type ? route.query.type as string : ''
      const sortBy = route.query.sortBy ? route.query.sortBy as string : ''
      const order = route.query.order ? route.query.order as string : ''
      const search = route.query.search ? route.query.search as string : ''
      const filter = {
        from: e.from,
        to: e.to
      }
      const { path } = route
      router.push({
        path: path,
        query: {
          page: 1,
          perPage: 7,
          search,
          type,
          sortBy,
          order,
          filter: JSON.stringify(filter)
        }
      })
    }

    // hook.
    onBeforeMount(() => {
      search.value = route.query.search ? route.query.search as string : ''
    })

    return {
      q,
      route,
      search,
      doSearch,
      dateModel,
      doOpenModal,
      clearFilter,
      handleDoOrder,
      handleDoFilter,
      handlerFilterByDate,
    }
  }
})
</script>

<style lang="scss" scoped>
.sort-title {
  color: $secondary;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
  /* 20px */
  text-transform: uppercase;
}

.sort-item-label {
  color: var(--Primary-Primary, #000);
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
  /* 15px */
  text-transform: uppercase;
}

.list-subitem-label {
  overflow: hidden;
  color: var(--Principales-950---Principal, #000);
  text-overflow: ellipsis;

  /* Desktop/Body/Text/Small */
  font-family: Ubuntu;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
  /* 15px */
}

.list-subitems {
  margin-top: 8px;
}

.list-subitem-label {
  padding-top: 8px;
  padding-bottom: 8px;
}

.menu-list {
  padding: 15px 20px 20px 20px;
}
</style>
