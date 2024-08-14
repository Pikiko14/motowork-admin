<template>
  <q-card square class="card-modal-motowork">
    <q-card-section>
      <span class="title-card-modal">
        {{ title }}
      </span>
      <q-btn v-close-popup class="btn-close-modal-motowork" round dense icon="img:/images/close.svg" flat>
        <q-tooltip square class="bg-red">
          Cerrar
        </q-tooltip>
      </q-btn>
    </q-card-section>
    <q-card-section style="margin-top: -10px">
      <slot name="content"></slot>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CardModalMotoworkComponent',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
})
</script>
