<template>
  <div class="row q-mt-lg">
    <div class="col-12">
      <div class="information">
        <svg width="22" height="22" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M8.0013 15.3332C12.0514 15.3332 15.3346 12.0499 15.3346 7.99984C15.3346 3.94975 12.0514 0.666504 8.0013 0.666504C3.95122 0.666504 0.667969 3.94975 0.667969 7.99984C0.667969 12.0499 3.95122 15.3332 8.0013 15.3332ZM6.0013 7.6665H7.33464V10.3332H6.0013V11.6665H10.0013V10.3332H8.66797V6.33317H6.0013V7.6665ZM8.66797 5.33317V3.99984H7.33464V5.33317H8.66797Z"
            fill="#B2B2B2" />
        </svg>
        <p>Recuerda que en la página principal encontrarás las 3 experiencias más recientes. Para explorar más a fondo y descubrir experiencias antiguas, te invitamos a ver la sección Post relacionados.</p>
      </div>
    </div>
    <div class="col-12 q-mt-lg">
      <div class="container">
        <div class="container__item">
          <span class="container__item--bold text-uppercase">TITULO del evento</span>
          <span class="container__item--normal">{{ blog.title }}</span>
        </div>

        <div class="container__item">
          <span class="container__item--bold text-uppercase">Fecha publicación</span>
          <span class="container__item--normal">{{ utils.formatDateIso(blog.createdAt) }}</span>
        </div>

        <div class="container__item">
          <span class="container__item--bold text-uppercase">Categoría</span>
          <span class="container__item--normal">{{ blog.category }}</span>
        </div>

        <div class="container__item">
          <span class="container__item--bold text-uppercase">subcategoría</span>
          <span class="container__item--normal">{{ blog.subcategory }}</span>
        </div>

        <div class="container__description">
          <p class="container__description--text">
            {{ blog.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// imports
import { defineProps } from 'vue'
import { Utils } from '../../../../utils/utils'
import { BlogsInterface } from '@/interfaces/blogs.interface'

// references
const utils = new Utils('blog');

// props
defineProps({
  blog: {
    type: Object as () => BlogsInterface,
    default: () => {
      return {}
    }
  }
})
</script>

<style scoped lang="scss">
.information {
  display: flex;
  gap: 12px;

  p {
    color: #9F9C9C;
    font-family: Ubuntu;
    font-size: 10pt;
    font-style: normal;
    font-weight: 400;
    line-height: 125%; /* 12.5px */
  }
}

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
    min-height: 180px;

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
</style>
