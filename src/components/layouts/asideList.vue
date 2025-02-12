<template>
  <section class="aside-list relative">
    <q-list>
      <q-item>
        <q-item-section class="text-center">
          <q-icon style="margin-left: -4px" name="img:/images/white-logo.svg" size="32px"></q-icon>
        </q-item-section>
      </q-item>
      <q-item clickable class="q-mt-sm" to="/dashboard">
        <q-item-section class="text-center">
          <q-icon :name="$route.path == '/dashboard' ? 'img:/images/home-primary.svg' : 'img:/images/home.svg'"
            size="24px"></q-icon>
          <q-tooltip class="bg-secondary" anchor="center right" self="center left" :offset="[10, 10]">
            Inicio
          </q-tooltip>
        </q-item-section>
      </q-item>
      <q-item clickable class="q-mt-sm" to="/dashboard/banners?page=1&perPage=7&search=">
        <q-item-section class="text-center">
          <q-icon
            :name="$route.path == '/dashboard/banners' ? 'img:/images/banners-primary.svg' : 'img:/images/banner.svg'"
            size="22px"></q-icon>
          <q-tooltip class="bg-secondary" anchor="center right" self="center left" :offset="[10, 10]">
            Banners
          </q-tooltip>
        </q-item-section>
      </q-item>
      <q-item clickable class="q-mt-sm"
        to="/dashboard/categories?page=1&perPage=7&search=&type=vehicle&sortBy=name&order=1">
        <q-item-section class="text-center">
          <q-icon
            :name="$route.path == '/dashboard/categories' ? 'img:/images/category-red.svg' : 'img:/images/category.svg'"
            size="24px"></q-icon>
          <q-tooltip class="bg-secondary" anchor="center right" self="center left" :offset="[10, 10]">
            Categorias
          </q-tooltip>
        </q-item-section>
      </q-item>
      <q-item clickable class="q-mt-sm"
        to="/dashboard/brands?page=1&perPage=7&search=&type=vehicle&sortBy=name&order=1">
        <q-item-section class="text-center">
          <q-icon
            :name="$route.path == '/dashboard/brands' ? 'img:/images/brands.svg' : 'img:/images/search-category.svg'"
            size="24px"></q-icon>
          <q-tooltip class="bg-secondary" anchor="center right" self="center left" :offset="[10, 10]">
            Marcas
          </q-tooltip>
        </q-item-section>
      </q-item>
      <q-item clickable class="q-mt-sm" to="/dashboard/products?page=1&perPage=10&search=&type=vehicle&sortBy=name&order=1">
        <q-item-section class="text-center">
          <q-icon
            :name="$route.path == '/dashboard/products' ? 'img:/images/products-primary.svg' : 'img:/images/products.svg'"
            size="24px"></q-icon>
            <q-tooltip class="bg-secondary" :offset="[10, 10]">
              Productos
            </q-tooltip>
        </q-item-section>
      </q-item>
      <q-item clickable class="q-mt-sm" to="/dashboard/orders?page=1&perPage=10&search=&type=Sales Order&sortBy=createdAt&order=-1">
        <q-item-section class="text-center">
          <q-icon
          style="margin-left: -3px;"
            :name="$route.path == '/dashboard/orders' ? 'img:/images/COMPRA ICONO ROJO.svg' : 'img:/images/COMPRA ICONO BLANCO.svg'"
            size="30px"></q-icon>
            <q-tooltip class="bg-secondary" :offset="[10, 10]">
              Ordenes
            </q-tooltip>
        </q-item-section>
      </q-item>
      <q-item clickable class="q-mt-sm" to="/dashboard/blogs?page=1&perPage=8&search=&sortBy=title&order=1">
        <q-item-section class="text-center">
          <q-icon :name="$route.path == '/dashboard/blogs' ? 'img:/images/blogs-primary.svg' : 'img:/images/blogs.svg'"
            size="24px"></q-icon>
            <q-tooltip class="bg-secondary" :offset="[10, 10]">
              Blogs
            </q-tooltip>
        </q-item-section>
      </q-item>
      <q-item clickable class="q-mt-sm" to="/dashboard/schedule?page=1&perPage=7&search=">
        <q-item-section class="text-center">
          <q-icon
            :name="$route.path == '/dashboard/schedule' ? 'img:/images/schedule-primary.svg' : 'img:/images/schedule.svg'"
            size="24px"></q-icon>
        </q-item-section>
      </q-item>
      <q-item class="absolute-bottom text-center" style="bottom: 20px;">
        <q-btn @click="doLogout" round color="secondary" size="8pt" icon="img:/images/logout.svg"></q-btn>
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
