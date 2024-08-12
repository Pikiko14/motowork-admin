<template>
  <section class="aside-list relative">
    <q-list>
      <q-item>
        <q-item-section class="text-center">
          <q-icon style="margin-left: -4px" name="img:images/white-logo.svg" size="32px"></q-icon>
        </q-item-section>
      </q-item>
      <q-item clickable class="q-mt-sm" to="/dashboard">
        <q-item-section class="text-center">
          <q-icon :name="$route.path == '/dashboard' ? 'img:images/home-primary.svg' : 'img:images/home.svg'"
            size="24px"></q-icon>
        </q-item-section>
      </q-item>
      <q-item clickable class="q-mt-sm" to="/dashboard/banners">
        <q-item-section class="text-center">
          <q-icon
            :name="$route.path == '/dashboard/banners' ? 'img:images/banners-primary.svg' : 'img:images/banner.svg'"
            size="24px"></q-icon>
        </q-item-section>
      </q-item>
      <q-item clickable class="q-mt-sm" to="/dashboard/products">
        <q-item-section class="text-center">
          <q-icon
            :name="$route.path == '/dashboard/products' ? 'img:images/products-primary.svg' : 'img:images/products.svg'"
            size="24px"></q-icon>
        </q-item-section>
      </q-item>
      <q-item clickable class="q-mt-sm" to="/dashboard/blogs">
        <q-item-section class="text-center">
          <q-icon :name="$route.path == '/dashboard/blogs' ? 'img:images/blogs-primary.svg' : 'img:images/blogs.svg'"
            size="24px"></q-icon>
        </q-item-section>
      </q-item>
      <q-item clickable class="q-mt-sm" to="/dashboard/schedule">
        <q-item-section class="text-center">
          <q-icon
            :name="$route.path == '/dashboard/schedule' ? 'img:images/schedule-primary.svg' : 'img:images/schedule.svg'"
            size="24px"></q-icon>
        </q-item-section>
      </q-item>
      <q-item class="absolute-bottom text-center">
        <q-btn @click="doLogout" round color="secondary" size="8pt" icon="logout"></q-btn>
      </q-item>
    </q-list>
  </section>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { defineComponent } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'AsideListComponent',
  setup() {
    // data
    const q = useQuasar()
    const router = useRouter()
    const authStore = useAuthStore()

    // methods
    const doLogout = () => {
      q.dialog({
        dark: false,
        title: 'Cerrar sesión',
        message: '¿Deseas cerrar la sesión y salir de la app?',
        cancel: true,
        persistent: true,
      }).onOk(() => {
        confirLogout();
      });
    }

    const confirLogout = async () => {
      const logout = await authStore.doLogout();
      if (logout)
        router.push({
          path: '/',
        });
    }

    return {
      doLogout
    }
  }
})
</script>
