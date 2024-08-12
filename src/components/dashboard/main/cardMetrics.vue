<template>
  <div class="user-welcome-item-section-item">
    <span class="title-card-welcome">
      {{ title }}
    </span>
    <span class="amount-card-welcome">
      {{ amount }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CardMetricsComponent',
  props: {
    title: {
      type: String,
      default: ''
    },
    amount: {
      type: String,
      default: '0000'
    }
  }
})
</script>
