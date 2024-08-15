<template>
  <section class="full-width motowork-table" :class="{ 'q-pr-lg': $q.screen.gt.sm }">
    <!--Table section-->
    <q-table v-model:pagination="pagination" hide-bottom flat bordered class="full-width hide-borders" :rows="rows"
      :columns="columns" row-key="name" separator="none">
      <!--Options tr-->
      <template v-slot:body-cell-options="props">
        <q-td class="text-center">
          <q-btn size="7.8pt" @click="doEdit(props.row.id)" flat dense icon="img:/images/pencil-edit.svg" round></q-btn>
          <q-btn @click="doDelete(props.row.id)" class="q-ml-20" size="10pt" color="black" flat dense
            icon="delete_sweep" round></q-btn>
        </q-td>
      </template>
      <!--End Options tr-->

      <!--Link tr-->
      <template v-slot:body-cell-link="props">
        <q-td class="text-center">
          <span class="link-table" @click="openUrl(props.row.link)">
            {{ props.row.link }}
          </span>
        </q-td>
      </template>
      <!--End Link tr-->

      <!--name banners tr-->
      <template v-slot:body-cell-location="props">
        <q-td class="text-left">
          <q-img class="banners-table-img" :src="`${$urlApi}${props.row.desktop_image?.path}`"></q-img>
          <span class="q-ml-20">{{ props.row.name }} - {{ props.row.type }}</span>
        </q-td>
      </template>
      <!--End name banners tr-->
    </q-table>
    <!--End Table section-->

    <!--Paginator section-->
    <div class="full-width q-mt-lg" v-if="totalPages > 0">
      <q-pagination @update:model-value="doPagination" color="secondary" direction-links v-model="currentPage"
        :max="totalPages" />
    </div>
    <!--End Paginator section-->
  </section>
</template>

<script lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { defineComponent, onBeforeMount, ref } from 'vue'
import { TableColumnsInterface } from 'src/interfaces/tableInterface';

export default defineComponent({
  name: 'TableMotoworkComponents',
  props: {
    rows: {
      type: Array as () => any,
      default: () => []
    },
    columns: {
      type: Array as () => TableColumnsInterface[],
      default: () => []
    },
    totalPages: {
      type: Number,
      default: 0
    }
  },
  emits: [
    'do-edit',
    'do-delete'
  ],
  setup(props, { emit }) {
    // data
    const pagination = ref({
      rowsPerPage: 7
    })
    const route = useRoute()
    const router = useRouter()
    const currentPage = ref<number>(1)

    // methods
    const doEdit = (id: string) => {
      emit('do-edit', id)
    }

    const openUrl = (url: string) => {
      window.open(url, '_blank')
    }

    const doPagination = (page: number) => {
      currentPage.value = page
      const search = route.query.search ? route.query.search as string : ''
      const perPage = route.query.perPage ? parseInt(route.query.perPage as string) : 12
      router.push({ name: 'banners', query: { page, perPage, search } })
    }

    const doDelete = (id: string) => {
      emit('do-delete', id)
    }

    // hook
    onBeforeMount(() => {
      currentPage.value = route.query.page ? parseInt(route.query.page as string) : 1
    })

    return {
      doEdit,
      openUrl,
      doDelete,
      pagination,
      currentPage,
      doPagination
    }
  }
})
</script>
