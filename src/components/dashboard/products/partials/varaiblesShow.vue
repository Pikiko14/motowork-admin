<template>
  <div class="row">
    <div class="col-12">
      <div class="container" v-for="(variant, idx) in product.variants" :key="idx" :class="{ 'q-mt-lg': idx > 0 }">
        <span class="text-bold variable-label">VARIABLE #{{ idx + 1 }}:</span>
        <div class="container__item">
          <span class="container__item--bold text-uppercase">Atributo</span>
          <span class="container__item--normal">{{ variant.attribute }}</span>
        </div>
        <div class="container__item">
          <span class="container__item--bold text-uppercase">SKU</span>
          <span class="container__item--normal">{{ variant.sku }}</span>
        </div>
        <div class="container__item" v-if="variant.description">
          <span class="container__item--bold text-uppercase">Descripción</span>
          <span class="container__item--normal q-pl-md">{{ variant.description }} </span>
        </div>
        <div class="container__item" v-if="variant.image">
          <span class="container__item--bold text-uppercase">Imagen</span>
          <span class="container__item--normal q-pl-md">
            <q-img :src="variant.image"></q-img>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// imports
import { defineProps } from 'vue';
import { ProductsInterface } from '@/interfaces/productsInterface';

// props
defineProps({
  product: {
    type: Object as () => ProductsInterface,
    default: () => {
      return {}
    }
  }
})
</script>

<style scoped lang="scss">
.container {
  display: flex;
  width: 100%;
  flex-direction: column;

  &__item {
    padding-top: 12px;
    padding-bottom: 12px;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    &--bold {
      color: #000;
      font-family: Play;
      font-size: 12pt;
      font-style: normal;
      font-weight: 400;
      line-height: 125%;
      /* 15px */
      text-transform: uppercase;
    }

    &--normal {
      color: #898384;
      text-align: right;
      /* Desktop/Body/Text/Small */
      font-family: Ubuntu;
      font-size: 12pt;
      font-style: normal;
      font-weight: 400;
      line-height: 125%;
      /* 15px */
      display: flex;

      .q-img {
        width: 80px;
      }

      &__color {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        border: 2px solid #FFF;
        background: #3344CB;
      }
    }
  }
}

.variable-label {
  font-size: 14pt;
}
</style>
