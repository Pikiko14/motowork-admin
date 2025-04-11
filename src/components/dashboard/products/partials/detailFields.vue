<template>
  <div class="row q-mt-lg">
    <div class="col-12 col-md-6" :class="{ 'q-pr-sm': $q.screen.gt.sm }">
      <label for="">Potencia / Cilindraje <span class="text-secondary">*</span></label>
      <q-input square type="number" :rules="[
        val => (val && val.length > 0) || 'Por favor ingrese el cilindraje',
        val => (val && val.length >= 1) || 'Mayor a 1 caracteres',
        val => (val && val.length <= 90) || 'Menor a 90 caracteres'
      ]" placeholder="Ingresa un cilindraje" class="q-mt-sm" outlined dense v-model="product.details.power">
        <template v-slot:append>
          CC
        </template>
      </q-input>
    </div>
    <div class="col-12 col-md-6" :class="{ 'q-pl-sm': $q.screen.gt.sm }">
      <label for="">Peso (Con aceite y gasolina) <span class="text-secondary">*</span></label>
      <q-input square :rules="[
        val => (val && val.length > 0) || 'Por favor ingrese el tipo de licencia',
        val => (val && val.length >= 1) || 'Mayor a 1 caracteres',
        val => (val && val.length <= 90) || 'Menor a 90 caracteres',
      ]" placeholder="Ingresa un tipo de licencia" class="q-mt-sm" outlined dense
        v-model="product.details.weight"></q-input>
    </div>
    <div class="col-12 col-md-6 ¿" :class="{ 'q-pr-sm': $q.screen.gt.sm }">
      <label for="">Potencia máxima <span class="text-secondary">*</span></label>
      <q-input square :rules="[
        val => (val && val.length > 0) || 'Por favor ingrese el almacenamiento',
        val => (val && val.length >= 1) || 'Mayor a 1 caracteres',
        val => (val && val.length <= 90) || 'Menor a 90 caracteres',
      ]" placeholder="Ingresa el almacenamiento" class="q-mt-sm" outlined dense
        v-model="product.details.max_power"></q-input>
    </div>
    <div class="col-12 col-md-6" :class="{ 'q-pl-sm': $q.screen.gt.sm }">
      <label for="">Torque maximo <span class="text-secondary">*</span></label>
      <q-input square :rules="[
        val => (val && val.length > 0) || 'Por favor ingrese un link de prueba de manejo',
        val => (val && val.length >= 1) || 'Mayor a 1 caracteres',
        val => (val && val.length <= 90) || 'Menor a 90 caracteres',
      ]" placeholder="Agrega un enlace de redirección" class="q-mt-sm" outlined dense
        v-model="product.details.torque"></q-input>
    </div>
    <div class="col-12">
      <label for="">Tipo de motor <span class="text-secondary">*</span></label>
      <q-input square :rules="[
        val => (val && val.length > 0) || 'Por favor ingrese un link de prueba de manejo',
        val => (val && val.length >= 1) || 'Mayor a 1 caracteres',
        val => (val && val.length <= 90) || 'Menor a 90 caracteres',
      ]" placeholder="Agrega un enlace de redirección" class="q-mt-sm" outlined dense
        v-model="product.details.type_engine"></q-input>
    </div>
    <div class="col-12">
      <label for="">Colores disponibles <span class="text-secondary">*</span></label>
      <div class="color-selector q-mt-sm">
        <div class="color" v-for="(color, idx) in product.details.colors" :key="idx"
          :style="{ backgroundColor: color.hex }">
          <q-menu auto-close max-height="330px" transition-show="rotate" transition-hide="rotate" :offset="[10, 10]">
            <q-list>
              <q-item
                clickable
                v-if="product.images && product.images.length > 0"
                v-for="(img, idxImg) in product.images" :key="idxImg"
                 @click="setColorImage(idx, img.path)"
              >
                <q-item-section>
                  <q-img :src="img.path" :alt="`Imagen del producto ${product.sku}`">
                    <div class="overflow-img" v-if="color.image === img.path">
                      <q-icon name="img:/images/check.png"></q-icon>
                    </div>
                  </q-img>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-btn @click="removeColor(idx)" label="Eliminar" color="secondary" unelevated></q-btn>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
        <div class="color bordered">
          <q-icon size="14pt" name="img:/images/search_black.svg"></q-icon>
          <q-menu :offset="[10, 10]" class="text-center" transition-show="rotate" transition-hide="rotate">
            <q-color class="shadow-0" v-model="color" no-footer style="max-width: 250px" />
            <q-btn label="Guardar" v-close-popup @click="addColor" color="secondary" class="q-mb-md" unelevated></q-btn>
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

const addColor = (hex: string) => {
  const colorobj = {
    hex: color.value,
    image: ''
  }
  props.product.details.colors.push(colorobj)
}

const setColorImage = (colorIdx: number, imgPath: string) => {
  props.product.details.colors[colorIdx].image = imgPath
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
