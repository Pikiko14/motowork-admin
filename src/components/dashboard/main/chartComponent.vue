<template>
  <div class="full-width relative">
    <div class="text-left">
      <span class="text-semi-bold">Productos por fecha</span>
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
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
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
        data: props.items, // Datos de productos publicados
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
      console.log(categories)
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
