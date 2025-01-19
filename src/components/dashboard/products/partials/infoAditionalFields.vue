<template>
  <div class="row">
    <q-scroll-area style="width: 100%; height: 450px" v-if="product.additionalInfo && product?.additionalInfo.length > 0">
      <div class="col-12 q-mt-lg" v-for="(section, idx) in product.additionalInfo">
        <!--Additional section-->
        <div class="aditional-section-detail">
          <ToggleInput class="q-mt-xs" size="sm" v-model="section.enable" />
          <p class="section-name" :class="{ 'text-gray-2': !section.enable }">
            <div class="ellipsis-1-lines" style="max-width:300px; display: inline-block">{{ section.sectionName }}</div>
            <span>
              <q-btn size="8pt" style="margin-top: -5px" icon="img:/images/trash.svg" flat dense @click="deleteSection(idx)">
                <q-tooltip class="bg-secondary">
                  Eliminar
                </q-tooltip>
              </q-btn>
            </span>
          </p>
          <span class="add-aditional-fields" @click="openSubSectionModal(idx)">
            <q-icon size="14pt" name="img:/images/add_sub_section.svg"></q-icon>
            <span class="label">
              Agregar subsección
            </span>
          </span>
        </div>
        <!--Add aditional section-->
  
        <!-- Additional sub section -->
         <div class="row q-mt-md" v-if="section.subsections.length > 0">
          <div class="col-12 col-md-6" v-for="(subSection, idxSub) in section.subsections" :key="idxSub" :class="{ 'q-pr-md': $q.screen.gt.sm && idxSub % 2 == 0, 'q-pl-md': $q.screen.gt.sm && idxSub % 2 == 1  }">
            <div class="col-12 col-md-6 relative">
              <label for="">
                {{ subSection.name }}
                <span class="text-secondary">*</span>
                <span class="add-aditional-fields">
                  <q-btn size="8pt" style="margin-top: -25px; right: 0px" icon="img:/images/trash.svg" flat dense @click="deleteSubSection(idx, idxSub)"></q-btn>
                </span>
              </label>
              <q-input square :rules="[
                val => (val && val.length > 0) || 'Por favor ingrese el valor de la información',
                val => (val && val.length >= 1) || 'Mayor a 1 caracteres',
                val => (val && val.length <= 90) || 'Menor a 90 caracteres',
              ]" placeholder="Ingresa un valor" class="q-mt-sm" outlined dense v-model="subSection.value"></q-input>
            </div>
          </div>
         </div>
         <!--End additional sub section-->
      </div>
    </q-scroll-area>

    <!--Add aditional section-->
    <div class="col-12" :class="{ 'q-mt-lg': product.additionalInfo && product.additionalInfo.length > 0 }">
      <q-btn @click="openAdditionalInforModal = true" label="AGREGAR SECCIÓN" color="secondary" flat></q-btn>
    </div>
    <!--Add aditional section-->

    <!--Additional information modal-->
    <q-dialog v-model="openAdditionalInforModal">
      <CardModalMotowork title="Agregar sección adicional">
        <template v-slot:content>
          <q-form @submit="handlerAddSection" class="row banner-form">
            <div class="col-12">
              <div class="col-12">
                <label for="">Nombre de la sección <span class="text-secondary">*</span></label>
                <q-input square :rules="[
                  val => (val && val.length > 0) || 'Por favor ingrese el nombre de la sección',
                  val => (val && val.length >= 1) || 'Mayor a 1 caracteres',
                  val => (val && val.length <= 90) || 'Menor a 90 caracteres',
                ]" placeholder="Ingresa un nombre" class="q-mt-sm" outlined dense
                  v-model="aditionalInfo.sectionName"></q-input>
              </div>
            </div>
            <div class="col-12">

            </div>
            <div class="col-12 col-md-6 q-mt-sm"
              :class="{ 'q-pr-md': $q.screen.gt.sm, 'full-width q-mt-md': $q.screen.lt.md }">
              <q-btn type="submit" unelevated square label="Guardar"
                class="full-width q-mt-md btn-cancel-solid"></q-btn>
            </div>
            <div class="col-12 col-md-6 q-mt-sm"
              :class="{ 'q-pl-md': $q.screen.gt.sm, 'full-width q-mt-md': $q.screen.lt.md }">
              <q-btn v-close-popup outline square label="Cancelar" class="full-width q-mt-md btn-cancel"></q-btn>
            </div>
          </q-form>
        </template>
      </CardModalMotowork>
    </q-dialog>
    <!--End additional information modal-->

    <!--Sub Additional information modal-->
    <q-dialog v-model="openSubAdditionalInforModal">
      <CardModalMotowork title="Agregar subsección">
        <template v-slot:content>
          <q-form @submit="handlerAddSubSection" class="row banner-form">
            <div class="col-12">
              <div class="col-12">
                <label for="">Nombre <span class="text-secondary">*</span></label>
                <q-input square :rules="[
                  val => (val && val.length > 0) || 'Por favor ingrese el nombre de la información',
                  val => (val && val.length >= 1) || 'Mayor a 1 caracteres',
                  val => (val && val.length <= 90) || 'Menor a 90 caracteres',
                ]" placeholder="Ingresa un nombre" class="q-mt-sm" outlined dense
                  v-model="subSection.name"></q-input>
              </div>
              <div class="col-12">
                <label for="">Valor <span class="text-secondary">*</span></label>
                <q-input square placeholder="Ingresa el valor" class="q-mt-sm" outlined dense
                  v-model="subSection.value"></q-input>
              </div>
            </div>
            <div class="col-12">

            </div>
            <div class="col-12 col-md-6 q-mt-sm"
              :class="{ 'q-pr-md': $q.screen.gt.sm, 'full-width q-mt-md': $q.screen.lt.md }">
              <q-btn type="submit" unelevated square label="Guardar"
                class="full-width q-mt-md btn-cancel-solid"></q-btn>
            </div>
            <div class="col-12 col-md-6 q-mt-sm"
              :class="{ 'q-pl-md': $q.screen.gt.sm, 'full-width q-mt-md': $q.screen.lt.md }">
              <q-btn v-close-popup outline square label="Cancelar" class="full-width q-mt-md btn-cancel"></q-btn>
            </div>
          </q-form>
        </template>
      </CardModalMotowork>
    </q-dialog>
    <!--End Sub additional information modal-->
  </div>
</template>

<script lang="ts" setup>
// imports
import { defineProps, ref } from 'vue';
import ToggleInput from 'src/components/commons/ToggleInput.vue'
import CardModalMotowork from '../../partials/cardModalMotowork.vue'
import { AdditionalInfoInterface, ProductsInterface, SubsectionInterface } from '@/interfaces/productsInterface'

// props
const props = defineProps({
  product: {
    type: Object() as () => ProductsInterface,
    required: true
  }
})

// references
const openAdditionalInforModal = ref<boolean>(false)
const aditionalInfo = ref<AdditionalInfoInterface>({
  enable: true,
  sectionName: '',
  subsections: [],
})

const subSection = ref<SubsectionInterface>({
  name: '',
  value: '',
})
const selectedAdditionalInfo = ref<number>(0)

const openSubAdditionalInforModal = ref<boolean>(false)

// methods
const handlerAddSection = () => {
  if (props.product.additionalInfo) {
    props.product.additionalInfo.push(aditionalInfo.value)
    aditionalInfo.value = {
      enable: true,
      sectionName: '',
      subsections: [],
    }
    openAdditionalInforModal.value = false
  }
}

const deleteSection = (idx: number) => {
  if (props.product.additionalInfo) {
    props.product.additionalInfo.splice(idx, 1)
  }
}

const openSubSectionModal = (idx: number) => {
  selectedAdditionalInfo.value = idx;
  openSubAdditionalInforModal.value = true
}

const handlerAddSubSection = () => {
  if (props.product.additionalInfo && props.product.additionalInfo?.length >= 0) {
    props.product.additionalInfo[selectedAdditionalInfo.value].subsections.push(subSection.value)
    subSection.value = {
      name: '',
      value: '',
    }
    openSubAdditionalInforModal.value = false
  }
}

const deleteSubSection = (idx: number, subIdx: number) => {
  if (props.product.additionalInfo && props.product.additionalInfo?.length >= 0) {
    props.product.additionalInfo[idx].subsections.splice(subIdx, 1)
  }
}
</script>

<style lang="scss" scoped>
.aditional-section-detail {
  display: flex;
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

.text-gray-2 {
  color: #9F9C9C;
}
</style>
