<template>
  <div class="row q-mt-lg">
    <div class="col-12 col-md-6" :class="{ 'q-pr-sm': $q.screen.gt.sm }">
      <label for="">Potencia / Cilindraje <span class="text-secondary">*</span></label>
      <q-input square :rules="[
        val => (val && val.length > 0) || 'Por favor ingrese el cilindraje',
        val => (val && val.length >= 1) || 'Mayor a 1 caracteres',
        val => (val && val.length <= 90) || 'Menor a 90 caracteres',
      ]" placeholder="Ingresa un cilindraje" class="q-mt-sm" outlined dense v-model="product.details.power"></q-input>
    </div>
    <div class="col-12 col-md-6" :class="{ 'q-pl-sm': $q.screen.gt.sm }">
      <label for="">Tipo licencia <span class="text-secondary">*</span></label>
      <q-input square :rules="[
        val => (val && val.length > 0) || 'Por favor ingrese el tipo de licencia',
        val => (val && val.length >= 1) || 'Mayor a 1 caracteres',
        val => (val && val.length <= 90) || 'Menor a 90 caracteres',
      ]" placeholder="Ingresa un tipo de licencia" class="q-mt-sm" outlined dense
        v-model="product.details.licenseType"></q-input>
    </div>
    <div class="col-12">
      <label for="">Almacenamiento <span class="text-secondary">*</span></label>
      <q-input square :rules="[
        val => (val && val.length > 0) || 'Por favor ingrese el almacenamiento',
        val => (val && val.length >= 1) || 'Mayor a 1 caracteres',
        val => (val && val.length <= 90) || 'Menor a 90 caracteres',
      ]" placeholder="Ingresa el almacenamiento" class="q-mt-sm" outlined dense
        v-model="product.details.storage"></q-input>
    </div>
    <div class="col-12">
      <label for="">Test drive <span class="text-secondary">*</span></label>
      <q-input square :rules="[
        val => (val && val.length > 0) || 'Por favor ingrese un link de prueba de manejo',
        val => (val && val.length >= 1) || 'Mayor a 1 caracteres',
        val => (val && val.length <= 90) || 'Menor a 90 caracteres',
      ]" placeholder="Agrega un enlace de redirección" class="q-mt-sm" outlined dense
        v-model="product.details.testDrive"></q-input>
    </div>
    <div class="col-12">
      <label for="">Colores disponibles <span class="text-secondary">*</span></label>
      <div class="color-selector q-mt-sm">
        <div @click="removeColor(idx)" class="color" v-for="(color, idx) in product.details.colors" :key="idx"
          :style="{ backgroundColor: color }"></div>
        <div class="color bordered">
          <q-icon size="14pt" name="img:/images/search_black.svg"></q-icon>
          <q-menu class="text-center">
            <q-color class="shadow-0" v-model="color" no-footer style="max-width: 250px" />
            <q-btn label="Gurdar" v-close-popup @click="product.details.colors.push(color)" color="secondary"
              class="q-mb-md" unelevated></q-btn>
          </q-menu>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// inport
import { defineProps, ref } from 'vue';
import { ProductsInterface } from '@/interfaces/productsInterface';

// props
const props = defineProps({
  product: {
    type: Object() as () => ProductsInterface,
    required: true
  }
})

// references
const color = ref<string>('#285de0')

// methods
const removeColor = (idx: number) => {
  props.product.details.colors.splice(idx, 1)
}
</script>

<style lang="scss" scoped>
.color-selector {
  display: flex;
  gap: 8.8px;
}

.color {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.bordered {
  border: 1.1px dashed #000;
}
</style>
