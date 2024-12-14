<template>
  <div class="row q-mt-lg">
    <div class="col-12 col-md-6" :class="{ 'q-pr-sm': $q.screen.gt.sm }">
      <label for="">Nombre <span class="text-secondary">*</span></label>
      <q-input square :rules="[
        val => (val && val.length > 0) || 'Por favor ingrese el nombre del producto',
        val => (val && val.length >= 1) || 'Mayor a 1 caracteres',
        val => (val && val.length <= 90) || 'Menor a 90 caracteres',
        val => /^[a-zA-Z0-9 áéíóúÁÉÍÓÚñÑüÜ&\/-]+$/.test(val) || 'Ingresa un valor valido',
      ]" placeholder="Ingresa un nombre" class="q-mt-sm" outlined dense v-model="product.name"></q-input>
    </div>
    <div class="col-12 col-md-6" :class="{ 'q-pl-sm': $q.screen.gt.sm }">
      <label for="">Modelo <span class="text-secondary">*</span></label>
      <q-input square :rules="[
        val => (val && val.length > 0) || 'Por favor ingrese el modelo del producto',
        val => (val && val.length >= 1) || 'Mayor a 1 caracteres',
        val => (val && val.length <= 90) || 'Menor a 90 caracteres',
        val => /^[a-zA-Z0-9 áéíóúÁÉÍÓÚñÑüÜ&\/-]+$/.test(val) || 'Ingresa un valor valido',
      ]" placeholder="Ingresa su modelo" class="q-mt-sm" outlined dense v-model="product.model"></q-input>
    </div>
    <div class="col-12 col-md-6 relative" :class="{ 'q-pr-sm': $q.screen.gt.sm }">
      <label for="">Estado <span class="text-secondary">*</span></label>
      <q-select hide-dropdown-icon class="q-mt-sm" square emit-value map-options
        :rules="[(val) => !!val || 'Selecciona una opción']" outlined dense v-model="product.state"
        :options="statesOptions"></q-select>
      <div class="select-custom-icom">
        <q-icon name="img:/images/chevron_right.svg"></q-icon>
      </div>
    </div>
    <div class="col-12 col-md-6 relative" :class="{ 'q-pl-sm': $q.screen.gt.sm }">
      <label for="">Marca <span class="text-secondary">*</span></label>
      <q-select hide-dropdown-icon use-input input-debounce="1500" @filter="filterBrands" class="q-mt-sm" square
        emit-value map-options :rules="[(val) => !!val || 'Selecciona una opción']" outlined dense
        v-model="product.brand" :options="brandsOptions"></q-select>
      <div class="select-custom-icom" style="right: 0px">
        <q-icon name="img:/images/chevron_right.svg"></q-icon>
      </div>
    </div>
    <div class="col-12 d-flex align-center space-between">
      <label for="">Precio desde <span class="text-secondary">*</span></label>
      <span class="discount-label">
        Dcto.
        <ToggleInput size="sm" v-model="product.enableDiscount" />
      </span>
    </div>
    <div class="col-12">
      <q-input square :rules="[
        val => (val && val.length > 0) || 'Por favor ingrese el valor del producto',
        val => /^\d+(\.\d+)?$/.test(val) || 'Ingresa un valor valido',
      ]" placeholder="Ingresa un valor" class="q-mt-sm" outlined dense v-model="product.price"></q-input>
    </div>
    <div class="col-12 col-md-6 q-pr-sm" v-if="product.enableDiscount">
      <label for="">Descuento</label>
      <q-input square :rules="[
        val => (val && val.length > 0) || 'Por favor ingrese el descuento',
        val => /^\d+(\.\d+)?$/.test(val) || 'Ingresa un valor valido',
      ]" placeholder="Ingresa un valor" class="q-mt-sm" outlined dense v-model="product.discount"></q-input>
    </div>
    <div class="col-12 relative" :class="{ 'col-md-6 q-pl-sm': $q.screen.gt.sm && product.enableDiscount }">
      <label for="">Categoría <span class="text-secondary">*</span></label>
      <q-select hide-dropdown-icon use-input input-debounce="1500" @filter="filterCategory" class="q-mt-sm" square
        emit-value map-options :rules="[(val) => !!val || 'Selecciona una opción']" outlined dense
        v-model="product.category" :options="categoriesOptions"></q-select>
      <div class="select-custom-icom" style="right: 0px; top: 29px">
        <q-icon name="img:/images/chevron_right.svg"></q-icon>
      </div>
    </div>
    <div class="col-12">
      <label for="">Descripción <span class="text-secondary">*</span></label>
      <q-input v-model="product.description" placeholder="Descripción del producto" class="q-mt-sm" square rows="3" outlined dense type="textarea"></q-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
// imports
import {
  computed,
  defineProps,
  onBeforeMount,
  ref
} from 'vue'
import { useQuasar } from 'quasar'
import mdiIconSet from 'quasar/icon-set/mdi-v7.js'
import { useBrandsStore } from '../../../../stores/brands'
import { useCategoriesStore } from '../../../../stores/category'
import { BrandsInterface } from '@/interfaces/brands.interface'
import ToggleInput from 'src/components/commons/ToggleInput.vue'
import { ProductsInterface } from '@/interfaces/productsInterface'
import { useRoute } from 'vue-router'

// props
defineProps({
  product: {
    type: Object() as () => ProductsInterface,
    default: () => {
      return {}
    }
  }
})

// references
const $q = useQuasar()
const route = useRoute()
const { type } = route.query
const brandsStore = useBrandsStore()
const categoriesStore = useCategoriesStore()
const statesOptions = ref(['Nueva', 'Usada'])

// computed
const brandsOptions = computed(() => {
  return brandsStore.brands.map((brand: BrandsInterface) => {
    return {
      value: brand.name,
      label: brand.name
    }
  })
})

const categoriesOptions = computed(() => {
  return categoriesStore.categories.map((brand: BrandsInterface) => {
    return {
      value: brand.name,
      label: brand.name
    }
  })
})

const filterBrands = (val: string, update: any) => {
  if (val === '') {
    update(() => {
      brandsStore.doListBrands(`?page=1&perPage=100&type=${type}&fields=name,id`)
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    brandsStore.doListBrands(`?page=1&perPage=100&type=${type}&fields=name,id&search=${needle}`)
  })
}

const filterCategory = (val: string, update: any) => {
  if (val === '') {
    update(() => {
      categoriesStore.doListCategories(`?page=1&perPage=100&type=${type}&fields=name,id`)
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    categoriesStore.doListCategories(`?page=1&perPage=100&type=${type}&fields=name,id&search=${needle}`)
  })
}

// hook
onBeforeMount (() => {
  $q.iconSet.set(mdiIconSet)
})
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
