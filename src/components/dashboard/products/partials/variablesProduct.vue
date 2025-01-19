<template>
  <div class="row q-mt-lg">
    <div class="col-12">
      <!--Additional section-->
      <div class="variants-section-detail">
        <p class="section-name">
          <div class="ellipsis-1-lines" style="max-width:300px; display: inline-block">Variantes del producto</div>
        </p>
        <span class="add-aditional-fields" @click="addNewVariant">
          <q-icon size="14pt" name="img:/images/add_sub_section.svg"></q-icon>
          <span class="label">
            Agregar variable
          </span>
        </span>
      </div>
      <!--Add aditional section-->
    </div>

    <div class="col-12 q-mt-lg">
      <q-scroll-area style="width: 100%; height: 450px" v-if="product.variants && product?.variants.length > 0">
        <div class="row full-width relative" v-for="(variant, idx) in product.variants" :key="idx" :class="{ 'q-mt-lg': idx > 0 }">
          {{ variant }}
          <div class="col-12 q-pb-lg">
            <span class="text-bold label-variable">VARIABLE {{ idx + 1 }}</span>
          </div>
          <div class="col-12 col-md-6" :class="{ 'q-pr-sm': $q.screen.gt.sm }">
            <label for="">SKU <span class="text-secondary">*</span></label>
            <q-input square :rules="[
              val => (val && val.length > 0) || 'Por favor ingrese el sku',
              val => (val && val.length >= 1) || 'Mayor a 1 caracteres',
              val => (val && val.length <= 60) || 'Menor a 90 caracteres',
            ]" placeholder="SKU-001" class="q-mt-sm" outlined dense v-model="variant.sku"></q-input>
          </div>
          <div class="col-12 col-md-6" :class="{ 'q-pl-sm': $q.screen.gt.sm }">
            <label for="">Atributo <span class="text-secondary">*</span></label>
            <q-input square :rules="[
              val => (val && val.length > 0) || 'Por favor ingrese el atributo',
              val => (val && val.length >= 1) || 'Mayor a 1 caracteres',
              val => (val && val.length <= 60) || 'Menor a 90 caracteres',
            ]" placeholder="S / Rojo" class="q-mt-sm" outlined dense
              v-model="variant.attribute"></q-input>
          </div>
          <div class="col-12 col-md-12">
            <label for="">Descripción</label>
            <q-input square type="textarea" class="q-mt-sm" outlined dense v-model="variant.description"></q-input>
          </div>

          <div class="col-12 col-md-12 q-mt-lg" v-if="product.images && product.images.length > 0">
            <label for="">Selecciona una imagen</label>
            <div class="gally-images">
              <div class="gally-images__item" v-for="(img, idxImg) in product.images" :key="idxImg" @click="setVariantImage(idx, img.path)">
                <q-img :src="img.path" :alt="`Imagen de la variable ${variant.sku}`">
                  <div class="overflow-img" v-if="variant.image === img.path">
                    <q-icon name="img:/images/check.png"></q-icon>
                  </div>
                </q-img>
              </div>
            </div>
          </div>
          <q-btn size="8pt" class="absolute-top-right" style="margin-top: -5px" icon="img:/images/trash.svg" flat dense @click="deleteVariable(idx)">
            <q-tooltip class="bg-secondary">
              Eliminar
            </q-tooltip>
          </q-btn>
        </div>
      </q-scroll-area>
    </div>
  </div>
</template>

<script lang="ts" setup>
// imports
import { defineProps, defineEmits } from 'vue'
import { ProductsInterface } from '@/interfaces/productsInterface'

// emit
const emit = defineEmits([
  'add-variant',
  'remove-variant',
  'set-image-variant'
])

// props
const props = defineProps({
  product: {
    type: Object() as () => ProductsInterface,
    default: () => {
      return {}
    }
  }
})

// methods
const addNewVariant = () => {
  emit('add-variant')
}

const deleteVariable = (idx: number) => {
  emit('remove-variant', idx)
}

const setVariantImage = (variantIdx: number, imgPath: string) => {
  emit('set-image-variant', { variantIdx, imgPath })
}
</script>

<style scoped lang="scss">
.variants-section-detail {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-content: center;
  width: 100%;
  position: relative;
  padding-top: 12px;
  padding-bottom: 12px;
}

.section-name {
  color: #000;
  font-family: Play;
  font-size: 16pt;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
  /* 20px */
  text-transform: uppercase;
}

.add-aditional-fields {
  float: right;
  display: flex;
  align-items: center;
  position: absolute;
  right: 0;
  gap: 12px;
  cursor: pointer;

  .label {
    overflow: hidden;
    color: $secondary;
    text-overflow: ellipsis;
    font-family: Ubuntu;
    font-size: 12pt;
    font-style: normal;
    font-weight: 400;
    line-height: 125%;

    @media (max-width: 1299px) {
      display: none;
    }
  }
}

.gally-images {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
  margin-top: 12px;

  &__item {
    flex: 1 1 calc(15% - 16px);
    max-width: calc(15% - 16px);
    box-sizing: border-box;
    cursor: pointer;

    .q-img {
      width: 100%;
      height: 100%;
    }
  }
}

.text-gray-2 {
  color: #9F9C9C;
}

.relative {
  position: relative;
}

.label-variable {
  font-size: 14pt;
}

.overflow-img {
  background: #0000004a;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
