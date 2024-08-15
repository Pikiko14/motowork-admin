<template>
  <div class="row q-py-md q-my-xs">
    <!-- headers -->
    <div class="col-12">
      <HeadersMotowork @open-modal="openModal" :title="'Categorías'" />
    </div>
    <!-- end headers -->

    <!--Modal Banners-->
    <q-dialog v-model="openModalCategory" @before-hide="clearData">
      <CardModalMotowork :title="category._id ? `Editar categoría ${category.name}` : 'Nueva categoría'">
        <template v-slot:content>
          <FormCategory @close-modal="openModal" />
        </template>
      </CardModalMotowork>
    </q-dialog>
    <!--End Modal Banners-->
  </div>
</template>

<script lang="ts">
import FormCategory from './components/form.vue'
import { defineComponent, ref } from 'vue'
import HeadersMotowork from '../partials/headersMotowork.vue'
import CardModalMotowork from '../partials/cardModalMotowork.vue'
import { CategoriesInterface, TypeCategory } from 'src/interfaces/categories.interface'

export default defineComponent({
  name: 'CategoriesMainComponent',
  components: {
    FormCategory,
    HeadersMotowork,
    CardModalMotowork
  },
  setup() {
    // data
    const category = ref<CategoriesInterface>({
      icon: '',
      name: '',
      type: TypeCategory.vehicle
    })
    const openModalCategory = ref<boolean>(false)

    // methods 
    const openModal = () => {
      openModalCategory.value = !openModalCategory.value
    }

    const clearData = () => {
      category.value = {
        icon: '',
        name: '',
        type: TypeCategory.vehicle
      }
    }

    return {
      category,
      clearData,
      openModal,
      openModalCategory
    }
  }
})
</script>
