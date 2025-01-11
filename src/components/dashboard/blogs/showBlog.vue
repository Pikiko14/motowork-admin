<template>
  <section class="full-width q-py-md q-my-xs" :class="{ 'q-pr-md': $q.screen.gt.sm }">
    <div class="row" v-if="blog && blog._id">
      <!--header-->
      <div class="col-12">
        <div class="d-flex">
          <q-btn style="margin-left: -10px" @click="$router.go(-1)" rounded flat dense
            icon="img:/images/back_chevron.svg"></q-btn>
          <h2 class="title q-pl-sm">Detalle del evento</h2>
        </div>
      </div>
      <!--end header-->

      <!--Gallery section-->
      <div class="col-12 col-md-5" v-if="blog && blog?._id" :class="{ 'q-pr-lg': $q.screen.gt.sm }">
        <div class="full-width q-mt-lg">
          <BlodGallery :images="blog?.images" />
        </div>
      </div>
      <!--End Gallery section-->

      <!--Data section-->
      <div class="col-12 col-md-7" :class="{ 'q-pl-lg q-pr-lg': $q.screen.gt.sm, 'q-mt-xl': $q.screen.lt.md }">
        <!--Title section-->
        <div class="col-12">
          <div class="title-section">
            <span class="title-section__title">
              {{ blog.title }}
            </span>
          </div>
        </div>
        <!--End title section-->

        <!--tab-->
        <q-tabs class="text-grey-7 q-mt-xl" v-model="tabFields" active-color="primary" indicator-color="primary" ina align="justify">
          <q-tab name="general" label="INFO. GENERAL" />
          <q-tab name="details" label="MAS DETALLES" />
        </q-tabs>
        <!--End tab-->

        <div class="col-12">
          <q-tab-panels v-model="tabFields" animated>
            <q-tab-panel name="general">
              <GeneralDataShow :blog="blog" />
            </q-tab-panel>
            <q-tab-panel name="details">
              <MoreDetailsShow :blog="blog" />
            </q-tab-panel>
          </q-tab-panels>
        </div>

        <!--buttons-->
        <div class="col-12">
          <div class="row">
            <div class="col-12 col-md-6" :class="{ 'q-pr-md': $q.screen.gt.sm, 'full-width': $q.screen.lt.md }">
              <q-btn :to="`/dashboard/blogs/${blog._id}/edit`" unelevated square label="Editar" class="full-width q-mt-md btn-cancel-solid"></q-btn>
            </div>
            <div class="col-12 col-md-6" :class="{ 'q-pl-md': $q.screen.gt.sm, 'full-width': $q.screen.lt.md }">
              <q-btn @click="deleteProducts(blog._id as string)" color="secondary" unelevated square label="Eliminar"
                class="full-width q-mt-md btn-cancel"></q-btn>
            </div>
          </div>
        </div>
        <!--End buttons-->
      </div>
    </div>

    <!--delete dialog-->
    <q-dialog v-model="openDeleteDialog" persistent>
      <CardModalMotowork title="Eliminar Evento">
        <template v-slot:content>
          <DeleteModal :showDiabledBtn="false" @delete="confirmDeleteProduct" :idDelete="blogToDelete"
            entity="Evento" />
        </template>
      </CardModalMotowork>
    </q-dialog>
    <!--End delete dialog-->
  </section>
</template>

<script lang="ts" setup>
// imports
const tabFields = ref('general')
import { useQuasar } from 'quasar'
import { ref, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogsStore } from '../../../stores/blog'
import BlodGallery from './partials/blodGallery.vue'
import MoreDetailsShow from './partials/MoreDetailsShow.vue'
import GeneralDataShow from './partials/GeneralDataShow.vue'
import { BlogsInterface } from '@/interfaces/blogs.interface'
import DeleteModal from 'src/components/commons/DeleteModal.vue'
import CardModalMotowork from '../partials/cardModalMotowork.vue'

// references
const q = useQuasar()
const route = useRoute()
const router = useRouter()
const store = useBlogsStore()
const blog = ref<BlogsInterface>({
  category: '',
  subcategory: '',
  title: '',
  description: '',
  more_details: '',
  images: []
})
const blogToDelete = ref<string>('')
const openDeleteDialog = ref<boolean>(false)

// methods
const loadBlog = async (id: string) => {
  try {
    const dataBlog = await store.doFilterBlog(id)
    if (dataBlog && dataBlog.blog) {
      blog.value = dataBlog.blog
    }
  } catch (error: any) {
    router.push({
      name: 'blogs',
      query: {
        page: 1,
        perPage: 10,
        search: '',
        sortBy: 'title',
        order: '1'
      }
    });
  }
}

const deleteProducts = async (id: string): Promise<void> => {
  openDeleteDialog.value = !openDeleteDialog.value
  blogToDelete.value = id
}

const confirmDeleteProduct = (id: string) => {
  q.dialog({
    dark: false,
    title: `Eliminar producto`,
    message: `¿Deseas ejecutar esta acción?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    alert(id)
    // await doDeleteProduct(id);
  })
}

// hook
onBeforeMount(async () => {
  const { id } = route.params
  await loadBlog(id as string)
})
</script>

<style scoped lang="scss">
.title {
  color: #000;
  font-family: Play;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 125%;
  /* 30px */
  text-transform: uppercase;
}

.fields-section {
  min-height: 400px;
}

.title-section {
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: center;

  &__title {
    color: #000;
    font-family: Play;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 125%;
    /* 30px */
    text-transform: uppercase;
  }
}
</style>
