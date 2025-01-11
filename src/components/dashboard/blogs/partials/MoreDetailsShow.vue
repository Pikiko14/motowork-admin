<template>
  <div class="row q-mt-lg" v-if="blog.more_details">
    <div class="col-12">
      <div class="container__description">
        <p class="container__description--text">
          {{ blog.more_details }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// imports
import { defineProps } from 'vue'
import { BlogsInterface } from '@/interfaces/blogs.interface'

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
    height: 400px;

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
