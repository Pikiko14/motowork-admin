<template>
  <section class="full-width motowork-table" :class="{ 'q-pr-lg': $q.screen.gt.sm }">
    <q-table hide-bottom flat bordered class="full-width hide-borders" :rows="rows" :columns="columns" row-key="name"
      separator="none">
      <!--Options tr-->
      <template v-slot:body-cell-options="props">
        <q-td class="text-center">
          <q-btn size="7.8pt" @click="doEdit(props.row.id)" flat dense icon="img:/images/pencil-edit.svg" round></q-btn>
          <q-btn class="q-ml-20" size="8pt" flat dense icon="img:/images/reset.svg" round></q-btn>
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
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
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
    }
  },
  emits: ['do-edit'],
  setup(props, { emit }) {
    // methods
    const doEdit = (id: string) => {
      emit('do-edit', id)
    }

    const openUrl = (url: string) => {
      window.open(url, '_blank')
    }

    return {
      doEdit,
      openUrl
    }
  }
})
</script>
