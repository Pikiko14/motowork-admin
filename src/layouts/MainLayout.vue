<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer v-if="$route.path !== '/'" v-model="drawer" side="left" fit :width="140">
      <q-scroll-area class="full-height bg-transparent q-pa-lg">
        <!-- Content here -->
        <AsideList />
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view :key="$route.fullPath" />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import AsideList from 'src/components/layouts/asideList.vue';

export default defineComponent({
  name: 'MainLayout',
  components: {
    AsideList
  },
  setup() {
    // data
    const drawer = ref<boolean>(true)

    return {
      drawer
    }
  }
})
</script>
