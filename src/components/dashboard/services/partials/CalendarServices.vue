<template>
  <div class="is-light-mode">
    <Qalendar style="height: 520px" class="is-light-mode" @updated-mode="filterByMode" @updated-period="filterByPeriod"
      :events="events" />
  </div>
</template>

<script setup>
// imports
import { date } from "quasar"
import { defineEmits } from 'vue'
import { Qalendar } from "qalendar"

// props
defineProps({
  events: {
    type: Array,
    default: () => []
  }
})

// emits
const emit = defineEmits(['filter-by-mode', 'filter-by-period'])

// methods
const filterByMode = (e) => {
  const { period } = e
  const end = date.formatDate(period.end, 'YYYY-MM-DD')
  const start = date.formatDate(period.start, 'YYYY-MM-DD')
  emit('filter-by-mode', { start, end })
}

const filterByPeriod = (e) => {
  const end = date.formatDate(e.end, 'YYYY-MM-DD')
  const start = date.formatDate(e.start, 'YYYY-MM-DD')
  emit('filter-by-period', { start, end })
}
</script>

<style>
@import "qalendar/dist/style.css";
</style>
