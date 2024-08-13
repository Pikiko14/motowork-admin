<template>
  <div class="full-width relative">
    <div class="chart-day-section">
      <q-btn text-color="white"
        :class="{ 'chart-day-disable': typeTime !== 'week', 'bg-secondary': typeTime === 'week' }" label="SEM." dense
        square unelevated class="q-px-lg text-weight-bold" @click="setTimePeriod('week')"></q-btn>
      <q-btn text-color="white"
        :class="{ 'chart-day-disable': typeTime !== 'months', 'bg-secondary': typeTime === 'months' }" label="MES" dense
        square unelevated class="q-px-lg text-weight-bold" @click="setTimePeriod('months')"></q-btn>
      <q-btn text-color="white"
        :class="{ 'chart-day-disable': typeTime !== 'years', 'bg-secondary': typeTime === 'years' }" label="AÑO" dense
        square unelevated class="q-px-lg text-weight-bold" @click="setTimePeriod('years')"></q-btn>
    </div>
    <div class="chart-section" v-if="render">
      <apexchart height="380px" type="area" :options="options" :series="series"></apexchart>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, watch } from 'vue'
import { format, startOfWeek, startOfMonth, startOfYear, add } from 'date-fns'

export default defineComponent({
  name: 'ChartComponent',
  setup() {
    const render = ref<boolean>(true)
    const typeTime = ref<string>('week')
    const options = ref<any>({
      chart: {
        type: 'area',
        height: 250,
        toolbar: {
          show: false, // Oculta la barra de herramientas
        },
      },
      colors: ['#7C7C7C', '#E5221F'], // Define los colores de las línea
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        type: 'datetime',
        categories: [],
      },
      yaxis: {
        labels: {
          show: false, // Oculta las etiquetas del eje Y
        },
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy',
        },
      },
    })

    const series = ref<any[]>([
      {
        name: 'PRODUCTOS PUBLICADOS',
        data: [50, 60, 70, 80, 90, 100, 60], // Datos de productos publicados
      },
      {
        name: 'PRODUCTOS VENDIDOS',
        data: [30, 40, 35, 50, 49, 60, 70], // Datos de productos vendidos
      },
    ])

    function getDates(period: string) {
      const now = new Date()
      let startDate: Date
      let endDate: Date

      switch (period) {
        case 'week':
          startDate = startOfWeek(now, { weekStartsOn: 1 })
          endDate = add(startDate, { weeks: 1 })
          break
        case 'months':
          startDate = startOfMonth(now)
          endDate = add(startDate, { months: 1 })
          break
        case 'years':
          startDate = startOfYear(now)
          endDate = add(startDate, { years: 1 })
          break
        default:
          startDate = new Date()
          endDate = new Date()
      }

      return {
        startDate,
        endDate,
      }
    }

    function updateChart() {
      const { startDate, endDate } = getDates(typeTime.value)
      const categories = []
      let currentDate = startDate

      while (currentDate < endDate) {
        categories.push(format(currentDate, typeTime.value === 'week' ? 'yyyy-MM-dd' : typeTime.value === 'months' ? 'yyyy-MM-dd' : 'yyyy-MM'))
        currentDate = add(currentDate, { [typeTime.value === 'week' ? 'days' : 'months']: 1 })
      }
      render.value = false
      options.value.xaxis.categories = categories
      setTimeout(() => {
        render.value = true
      }, 100)
    }

    function setTimePeriod(period: string) {
      typeTime.value = period
      updateChart()
    }

    // hooks
    onBeforeMount(() => {
      updateChart()
    })

    return {
      render,
      series,
      options,
      typeTime,
      setTimePeriod,
    }
  }
})
</script>

<style></style>
