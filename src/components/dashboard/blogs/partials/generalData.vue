<template>
  <div class="row q-mt-lg">
    <div class="col-12" :class="{ 'q-pr-sm': $q.screen.gt.sm }">
      <label for="">Titulo del evento <span class="text-secondary">*</span></label>
      <q-input square :rules="[
        val => (val && val.length > 0) || 'Por favor ingrese el titulo del evento',
        val => (val && val.length >= 1) || 'Mayor a 1 caracteres',
        val => (val && val.length <= 120) || 'Menor a 90 caracteres',
        val => /^[a-zA-Z0-9 áéíóúÁÉÍÓÚñÑüÜ&\/-]+$/.test(val) || 'Ingresa un valor valido',
      ]" placeholder="Ingresa un titulo" class="q-mt-sm" outlined dense v-model="blog.title"></q-input>
    </div>
    <div class="col-12 col-md-6 relative" :class="{ 'q-pr-sm': $q.screen.gt.sm }">
      <label for="">Categoría <span class="text-secondary">*</span></label>
      <q-select @update:model-value="filterSubcategories" label="Selecciona una categoría" hide-dropdown-icon
        class="q-mt-sm" square emit-value map-options :rules="[(val) => !!val || 'Selecciona una opción']" outlined
        dense v-model="blog.category" :options="categoriesOptions"></q-select>
      <div class="select-custom-icom">
        <q-icon name="img:/images/chevron_right.svg"></q-icon>
      </div>
    </div>
    <div class="col-12 col-md-6 relative" :class="{ 'q-pl-sm': $q.screen.gt.sm }">
      <label for="">Subcategoría</label>
      <q-select label="Selecciona una subcategoría" hide-dropdown-icon class="q-mt-sm" square emit-value map-options
        outlined dense v-model="blog.subcategory" :options="filteredSubcategories"></q-select>
      <div class="select-custom-icom" style="right: 0px; top: 29px">
        <q-icon name="img:/images/chevron_right.svg"></q-icon>
      </div>
    </div>
    <div class="col-12" :class="{ 'q-pr-sm': $q.screen.gt.sm }">
      <label for="">Descripción <span class="text-secondary">*</span></label>
      <q-input type="textarea" square :rules="[
        val => (val && val.length > 0) || 'Por favor ingrese la descripción del evento',
        val => (val && val.length >= 1) || 'Mayor a 1 caracteres',
      ]" placeholder="Ingresa la descripción del evento" class="q-mt-sm" outlined dense v-model="blog.description"></q-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import
import { defineProps, ref } from 'vue'
import { BlogsInterface } from '@/interfaces/blogs.interface'

// references
const categoriesOptions = [
  'Noticias',
  'Consejos y Guías',
  'Técnicos',
  'Estilo de vida',
  'Comunidad'
]
const subcategories = [
  {
    label: 'Marcas',
    value: 'Marcas',
    category: 'Noticias'
  },
  {
    label: 'Mantenimiento',
    value: 'Mantenimiento',
    category: 'Consejos y Guías'
  },
  {
    label: 'Conducción',
    value: 'Conducción',
    category: 'Consejos y Guías'
  },
  {
    label: 'Viajes',
    value: 'Viajes',
    category: 'Consejos y Guías'
  },
  {
    label: 'Motor',
    value: 'Motor',
    category: 'Técnicos'
  },
  {
    label: 'Suspensión',
    value: 'Suspensión',
    category: 'Técnicos'
  },
  {
    label: 'Frenos',
    value: 'Frenos',
    category: 'Técnicos'
  },
  {
    label: 'Moda',
    value: 'Moda',
    category: 'Estilo de vida'
  },
  {
    label: 'Música',
    value: 'Música',
    category: 'Estilo de vida'
  },
  {
    label: 'Pelicular',
    value: 'Pelicular',
    category: 'Estilo de vida'
  },
  {
    label: 'Eventos',
    value: 'Eventos',
    category: 'Estilo de vida'
  },
  {
    label: 'Regiones',
    value: 'Regiones',
    category: 'Comunidad'
  },
  {
    label: 'Viajes',
    value: 'Viajes',
    category: 'Comunidad'
  },
  {
    label: 'Rutas',
    value: 'Rutas',
    category: 'Comunidad'
  },
  {
    label: 'Carreras',
    value: 'Carreras',
    category: 'Comunidad'
  },
  {
    label: 'Reseñas',
    value: 'Reseñas',
    category: 'Comunidad'
  }
]
const filteredSubcategories = ref<any[]>([])

// props
defineProps({
  blog: {
    type: Object() as () => BlogsInterface,
    default: () => {
      return {}
    }
  }
})

// methods
const filterSubcategories = (e: string) => {
  filteredSubcategories.value = subcategories.filter((item) => item.category === e);
}
</script>

<style lang="scss" scoped>
.discount-label {
  display: flex;
  overflow: hidden;
  color: #000;
  text-overflow: ellipsis;
  /* Desktop/Body/Text/Small */
  font-family: Ubuntu;
  font-size: 12pt;
  gap: 8px;
  font-style: normal;
  font-weight: 400;
  line-height: 125%;
  /* 15px */
}

.select-custom-icom {
  background-color: red;
  width: 40px;
  height: 40px;
  position: absolute;
  right: 8px;
  top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 1024px) {
    right: 0px;
  }
}
</style>