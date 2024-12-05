<template>
  <div class="d-flex">
    <q-img class="delete-modal-icon" src="/images/delete-modal-icon.png" />
    <p class="delete-description">
      ¿Estás seguro de que deseas eliminar esta categoría? Esta acción es irreversible y eliminará toda la información
      relacionada con la misma, incluyendo Detalles de la categoría, Datos de ventas, Contenido asociado
    </p>
    <div class="footer-modal">
      <div class="icon">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M7.99935 15.3334C12.0494 15.3334 15.3327 12.0501 15.3327 8.00002C15.3327 3.94993 12.0494 0.666687 7.99935 0.666687C3.94926 0.666687 0.666016 3.94993 0.666016 8.00002C0.666016 12.0501 3.94926 15.3334 7.99935 15.3334ZM5.99935 7.66669H7.33268V10.3334H5.99935V11.6667H9.99935V10.3334H8.66602V6.33335H5.99935V7.66669ZM8.66602 5.33335V4.00002H7.33268V5.33335H8.66602Z"
            fill="#B2B2B2" />
        </svg>
      </div>
      <p>
        Al eliminar esta {{ entity }}, perderás todos los datos asociados. <span>Te recomendamos desactivarla para
          preservar tu
          información asociada.</span>
      </p>
    </div>
    <div class="modal-action row full-width">
      <div class="col-12 col-md-6 q-mt-sm"
        :class="{ 'q-pr-md': $q.screen.gt.sm, 'full-width q-mt-md': $q.screen.lt.md }">
        <q-btn v-close-popup unelevated square label="Desactivar" class="full-width q-mt-md btn-cancel-solid"></q-btn>
      </div>
      <div class="col-12 col-md-6 q-mt-sm"
        :class="{ 'q-pl-md': $q.screen.gt.sm, 'full-width q-mt-md': $q.screen.lt.md }">
        <q-btn @click="doDelete" unelevated color="secondary" v-close-popup square label="Eliminar"
          class="full-width q-mt-md btn-cancel"></q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DeleteModal',
  emits: ['do-delete-category'],
  props: {
    entity: {
      type: String,
      required: true
    },
    idDelete: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    // references
    const q = useQuasar()

    // methods
    const doDelete = () => {
      q.dialog({
        dark: false,
        title: `Eliminar ${props.entity}`,
        message: `¿Deseas ejecutar esta acción?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        confirnDelete()
      })
    }

    const confirnDelete = () => {
      emit('do-delete-category', null)
    }

    return {
      doDelete
    }
  }
});
</script>

<style lang="scss" scoped>
.d-flex {
  display: flex;
  gap: 16px;
  flex-direction: column;

  .delete-modal-icon {
    width: 148px;
    height: 148px;
  }

  .delete-description {
    color: $primary;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 125%;
  }

  .footer-modal {
    display: flex;
    gap: 10px;
    align-items: flex-start;

    svg {
      width: 16px;
      height: 16px;
    }

    p {
      color: #9F9C9C;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 125%;

      span {
        color: var(--Neutrals-Neutrals400, #9F9C9C);
        font-weight: 700;
      }
    }
  }

  .modal-action {
    margin-top: 32px;
    display: flex;
  }
}

p {
  margin: 0;
}
</style>
