<template>
  <section class="row">
    <div class="col-12">
      <div class="container-aditional">
        <div class="container-aditional__item" v-for="(item, idx) in product.additionalInfo" :key="idx"
          @click="showAditionalInformation(idx)" v-show="item.enable">
          <span class="container-aditional__item--title">
            {{ item.sectionName }}
            <q-icon size="14pt" name="img:/images/chevron_right_red.svg"></q-icon>
          </span>

          <div class="container q-px-lg" :class="{ 'height-auto': openInAditionalSection.includes(idx) }" v-show="openInAditionalSection.includes(idx)">
            <div class="container__item" v-for="(subitem, idx) in item.subsections" :key="idx">
              <span class="container__item--bold text-uppercase">{{ subitem.name }}</span>
              <span class="container__item--normal">{{ subitem.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
// imports
import { defineProps, ref } from 'vue';
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

const openInAditionalSection = ref<number[]>([])

// methods
const showAditionalInformation = (idx: number) => {
  const issetIndex = openInAditionalSection.value.findIndex((item: number) => item === idx)
  if (issetIndex != -1) {
    openInAditionalSection.value.splice(idx, 1)
    return true
  }
  openInAditionalSection.value.push(idx)
}
</script>

<style lang="scss" scoped>
.container-aditional {
  width: 100%;
  display: flex;
  flex-direction: column;

  &__item {
    display: flex;
    flex-direction: column;
    cursor: pointer;

    &--title {
      padding-top: 12px;
      padding-bottom: 12px;
      color: #000;
      font-family: Play;
      font-size: 12pt;
      font-style: normal;
      font-weight: 700;
      line-height: 125%;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
      width: 100%;

      &:hover {
        background: #f5f5f5;
      }
    }
  }
}

.container {
  display: flex;
  width: 100%;
  height: 100px;
  flex-direction: column;
  transition: all 1s ease-in;


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
}

.height-auto {
  height: 250px;
}
</style>
