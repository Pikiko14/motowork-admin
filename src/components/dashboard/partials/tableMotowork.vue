<template>
  <section class="full-width" :class="{ 'q-pr-lg': $q.screen.gt.sm }">
    <q-table flat bordered class="full-width hide-borders" :rows="rows" :columns="columns" row-key="name"
      separator="none" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { TableColumnsInterface } from 'src/interfaces/tableInterface';

export default defineComponent({
  name: 'TableMotoworkComponents',
  props: {
    rows: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array as () => TableColumnsInterface[],
      default: () => []
    }
  }
})
</script>
