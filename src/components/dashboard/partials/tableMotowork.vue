<template>
  <section class="full-width motowork-table" :class="{ 'q-pr-lg': $q.screen.gt.sm }">
    <!--Table section-->
    <q-table :selection="enableSelection ? 'multiple' : 'none'" v-model:pagination="pagination" hide-bottom flat
      bordered class="full-width hide-borders" :rows="rows" :columns="columns" row-key="name" separator="none">
      <!--Selection slot-->
      <template v-slot:header-selection> <!--Disable default header slot-->
      </template>
      <template v-slot:body-selection="scope">
        <ToggleInput @update:modelValue="doChangeStatus(scope.row._id)" v-model="scope.row.is_active" />
      </template>
      <!--End Selection slot-->

      <!--Options tr-->
      <template v-slot:body-cell-options="props">
        <q-td class="text-center">
          <q-btn size="7.8pt" @click="doEdit(props.row._id)" flat dense icon="img:/images/pencil-edit.svg" round>
            <q-tooltip square class="bg-primary">
              Editar
            </q-tooltip>
          </q-btn>
          <q-btn @click="doDelete(props.row._id)" class="q-ml-20" size="9pt" color="black" flat dense
            icon="img:/images/trash.svg" round>
            <q-tooltip square class="bg-red">
              Eliminar
            </q-tooltip>
          </q-btn>
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
          <q-img v-if="props.row.desktop_image?.path" class="banners-table-img" :src="`${props.row.desktop_image?.path}`"></q-img>
          <span class="q-ml-20">{{ props.row.name }} - {{ props.row.type }}</span>
        </q-td>
      </template>
      <!--End name banners tr-->

      <!--Name category-->
      <template v-slot:body-cell-category="props">
        <q-td class="text-left category-name-img">
          <q-img v-if="props.row.icon" class="banners-table-img" :src="`${props.row.icon}`"></q-img>
          {{ props.row.name }}
        </q-td>
      </template>
      <!--End name category-->

      <!--Date creation category-->
      <template v-slot:body-cell-dateCategory="props">
        <q-td class="text-left">
          {{ formatDate(props.row.createdAt) }}
        </q-td>
      </template>
      <!--End Date creation category-->

      <!--Items asociated-->
      <template v-slot:body-cell-asociated_items="props">
        <q-td class="text-left">
          <div class="d-flex">
            <div class="items news" v-if="props.row.count_news > 0">
              {{ padNumbers(props.row.count_news) }} Cantidad nuevas
            </div>
            <div class="items used" v-if="props.row.count_used > 0">
              {{ padNumbers(props.row.count_used) }} cantidad usadas
            </div>
            <div v-if="props.row.count_items > 0">
              {{ padNumbers(props.row.count_items) }} (Número de items vinculados)
            </div>
          </div>
        </q-td>
      </template>
      <!--End items asociated-->

      <!--Name brands-->
      <template v-slot:body-cell-brand="props">
        <q-td class="text-left brand-name-img">
          <div class="brand-img-wrapper" v-if="props.row.icon">
            <q-img class="banners-table-img-brands" :src="`${props.row.icon}`" />
          </div>
          {{ props.row.name }}
        </q-td>
      </template>
      <!--End name category-->

    </q-table>
    <!--End Table section-->

    <!--Paginator section-->
    <div class="full-width q-mt-lg" v-if="totalPages > 0">
      <q-pagination @update:model-value="doPagination" color="secondary" v-model="currentPage" :max="totalPages" />
    </div>
    <!--End Paginator section-->
  </section>
</template>

<script lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { defineComponent, onBeforeMount, ref } from 'vue'
import ToggleInput from 'src/components/commons/ToggleInput.vue'
import { TableColumnsInterface } from 'src/interfaces/tableInterface'

export default defineComponent({
  name: 'TableMotoworkComponents',
  components: {
    ToggleInput
  },
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
    },
    enableSelection: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'do-edit',
    'do-delete',
    'do-toggle-status'
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
    const doEdit = (id: string): void => {
      emit('do-edit', id)
    }

    const openUrl = (url: string): void => {
      window.open(url, '_blank')
    }

    const doPagination = (page: number): void => {
      currentPage.value = page
      const search = route.query.search ? route.query.search as string : ''
      const perPage = route.query.perPage ? parseInt(route.query.perPage as string) : 7
      const type = route.query.type ? route.query.type as string : ''
      const { path } = route
      router.push({ path: path, query: { page, perPage, search, type } })
    }

    const doDelete = (id: string): void => {
      emit('do-delete', id)
    }

    const formatDate = (isoDate: Date): string => {
      const date = new Date(isoDate);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const formattedDate = date.toLocaleDateString('es-ES', options);
      const dateSplit = formattedDate.split(" ");
      return `${dateSplit[2] ? dateSplit[2].toUpperCase() : ''} ${dateSplit[0] ? dateSplit[0] : ''}, ${dateSplit[4]}`;
    }

    const padNumbers = (number: number): string => {
      return number.toString().padStart(3, '0');
    }

    const doChangeStatus = (id: string): void => {
      emit('do-toggle-status', id)
    }

    // hook
    onBeforeMount(() => {
      currentPage.value = route.query.page ? parseInt(route.query.page as string) : 1
    })

    return {
      doEdit,
      openUrl,
      doDelete,
      padNumbers,
      formatDate,
      pagination,
      currentPage,
      doPagination,
      doChangeStatus,
    }
  }
})
</script>

<style lang="scss" scoped>
.d-flex {
  display: flex;
  gap: 20px;

  .items {
    width: auto;
    height: 21px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 12px;
    padding-right: 12px;
  }
}
</style>
