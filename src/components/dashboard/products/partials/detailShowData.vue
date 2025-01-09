<template>
  <div class="row">
    <div class="col-12">
      <div class="container">
        <div class="container__item">
          <span class="container__item--bold text-uppercase">Potencia / Cilindraje</span>
          <span class="container__item--normal">{{ product.details.power }}</span>
        </div>

        <div class="container__item">
          <span class="container__item--bold text-uppercase">Peso</span>
          <span class="container__item--normal">{{ product.details.weight }}</span>
        </div>

        <div class="container__item">
          <span class="container__item--bold text-uppercase">Potencia maxima</span>
          <span class="container__item--normal">{{ product.details.max_power }}</span>
        </div>

        <div class="container__item">
          <span class="container__item--bold text-uppercase">Tipo de motor</span>
          <span class="container__item--normal">{{ product.details.type_engine }}</span>
        </div>

        <div class="container__item">
          <span class="container__item--bold text-uppercase">Colores disponibles</span>
          <span class="container__item--normal">
            <div
              class="container__item--normal__color"
              v-for="(color, idx) in product.details.colors" :key="idx"
              :style="{ backgroundColor: color, zIndex: product.details.colors.length - idx, marginLeft: '-10px' }"
            >
            </div>
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
</style>
