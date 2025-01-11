<template>
  <div class="row q-mt-lg">
    <div class="col-12" :class="{ 'q-pr-sm': $q.screen.gt.sm }">
      <label for="">Mas detalles</label>
      <q-input type="textarea" square rows="20" placeholder="Agrega mas detalles" class="q-mt-sm" outlined dense v-model="blog.more_details"></q-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import
import { defineProps, ref } from 'vue'
import { BlogsInterface } from '@/interfaces/blogs.interface'

// props
defineProps({
  blog: {
    type: Object() as () => BlogsInterface,
    default: () => {
      return {}
    }
  }
})
</script>
