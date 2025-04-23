<template>
  <div class="is-light-mode">
    <Qalendar @event-was-clicked="openEventData" style="height: 720px" class="is-light-mode" @updated-mode="filterByMode" @updated-period="filterByPeriod"
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
const emit = defineEmits(['filter-by-mode', 'filter-by-period', 'open-modal-data'])

// methods
const filterByMode = (e) => {
  const { period } = e;
  const end = getTime(period.end);
  const start = date.formatDate(period.start, 'YYYY-MM-DD');
  emit('filter-by-mode', { start, end });
}

const getTime = (dateString) => {
  return date.formatDate(date.addToDate(dateString, { days: 1 }), "YYYY-MM-DD");
}

const filterByPeriod = (e) => {
  const end = getTime(e.end)
  const start = date.formatDate(e.start, 'YYYY-MM-DD')
  emit('filter-by-period', { start, end })
}

const openEventData = (e) => {
  const { id } = e?.clickedEvent;
  emit('open-modal-data', id)
}
</script>

<style>
@import "qalendar/dist/style.css";
</style>
