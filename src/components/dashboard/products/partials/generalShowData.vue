<template>
  <div class="row" v-if="product">
    <div class="col-12">
      <div class="container">
        <div class="container__item">
          <span class="container__item--bold text-uppercase">Nombre</span>
          <span class="container__item--normal">{{ product.name }}</span>
        </div>

        <div class="container__item">
          <span class="container__item--bold text-uppercase">modelo</span>
          <span class="container__item--normal">{{ product.model }}</span>
        </div>

        <div class="container__item">
          <span class="container__item--bold text-uppercase">Categoría</span>
          <span class="container__item--normal">{{ product.category }}</span>
        </div>

        <div class="container__item">
          <span class="container__item--bold text-uppercase">Estado</span>
          <span class="container__item--normal">{{ product.state }}</span>
        </div>

        <div class="container__item">
          <span class="container__item--bold text-uppercase">Marca</span>
          <span class="container__item--normal">{{ product.brand }}</span>
        </div>

        <div class="container__item">
          <span class="container__item--bold text-uppercase">Precio desde</span>
          <span class="container__item--normal" :class="{ 'have-discount': product.discount }">{{ utils.formatPrice(product.price as number) }}</span>
        </div>

        <div class="container__item">
          <span class="container__item--bold text-uppercase">Descuento</span>
          <span class="container__item--normal">{{ utils.formatPrice(product.discount as number) }}</span>
        </div>

        <div class="container__description">
          <p class="container__description--text">
            {{ product.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// imports
import { defineProps } from 'vue';
import { Utils } from '../../../../utils/utils'
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

// references
const utils = new Utils('product')
</script>

<style lang="scss" scoped>
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
      line-height: 125%; /* 15px */
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
      line-height: 125%; /* 15px */
    }
  }

  &__description {
    padding: 12px 16px;
    align-items: center;
    gap: 10px;
    flex: 1 0 0;
    align-self: stretch;
    text-wrap: wrap;
    background: #F5F5F5;
    margin-top: 8px;

    &--text {
      color: #9F9C9C;
      font-family: Ubuntu;
      font-size: 12pt;
      font-style: normal;
      font-weight: 400;
      line-height: 125%; /* 15px */
    }
  }
}

.have-discount {
  text-decoration: line-through !important;
}
</style>
