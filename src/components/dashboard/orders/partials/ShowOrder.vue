<template>
  <div class="row">
    <!--Shipping-->
    <div class="col-12 col-md-6">
      <h2>
        Detalles de facturación
      </h2>
      <span>
        {{ order.client.firstName || '' }} {{ order.client.lastName || '' }}
      </span><br>
      <span>
        {{ order.client.address || '' }}, {{ order.client.city || '' }} - {{ order.client.state || '' }}
      </span><br>
      <span>
        Colombia
      </span><br /><br />
      <span class="text-bold" style="font-weight: 600">
        Correo electrónico:
      </span><br />
      <span>
        <a :href="`mailto:${order.client.email}`">{{ order.client.email || '' }}</a>
      </span><br /><br />
      <span class="text-bold" style="font-weight: 600">
        Teléfono:
      </span><br />
      <span>
        <a :href="`tel:${order.client.email}`">{{ order.client.phone || '' }}</a>
      </span><br /><br />
      <span class="text-bold" style="font-weight: 600">
        Pago mediante:
      </span><br />
      <span class="payment-span">
        {{ order.payment_method === 'mercadopago' ? 'Mercadopago' : 'Transferencia' }}
        <img v-if="order.payment_method === 'mercadopago'" src="/images/mercado_pago.webp" width="25px"
          alt="Mercado pago" title="Mercado pago">
        <img v-else src="/images/transferencia_bancaria.webp" width="25px" alt="Mercado pago" title="Mercado pago">
      </span>
    </div>

    <div class="col-12 col-md-6">
      <h2>
        Detalles de envío
      </h2>
      <span>
        {{ order.client.firstName || '' }} {{ order.client.lastName || '' }}
      </span><br />
      <span>
        {{ order.client.address || '' }}, {{ order.client.city || '' }} - {{ order.client.state || '' }}
      </span><br>
      <span>
        Colombia
      </span><br /><br />
      <span>
        <span class="text-bold" style="font-weight: 600">
          Metodo de envio:
        </span><br />
        <span>
          {{ order.shippingMethod === 'delivery' ? 'Envio' : 'Recogida en local' }}
        </span>
        <span v-if="order.shippingMethod === 'delivery'"> - {{ order.conveyor || '' }}</span>
      </span>
      <br /><br />
      <span class="text-bold" style="font-weight: 600">
        Estado del pago:
      </span><br />
      <span class="span-chip">
        <div class="chip news" v-if="order.status === 'Pago Completado'">
          {{ order.status }}
        </div>
        <div class="chip danger"
          v-if="order.status !== 'Pendiente' && order.status !== 'Pago Completado' && order.status !== 'En proceso de pago'">
          {{ order.status }}
          <q-menu class="round" v-if="order.payment_method === 'trasnferencia'">
            <q-list>
              <q-item v-for="(status, idx) in statusArray" :key="idx" clickable v-close-popup
                v-show="status !== order.status" @click="setOrderStatus(status)">
                <q-item-section>{{ status }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
        <div class="chip used" v-if="order.status == 'Pendiente' || order.status === 'En proceso de pago'">
          {{ order.status }}
          <q-menu class="round" v-if="order.payment_method === 'trasnferencia'">
            <q-list>
              <q-item v-for="(status, idx) in statusArray" :key="idx" clickable v-close-popup
                v-show="status !== order.status" @click="setOrderStatus(status)">
                <q-item-section>{{ status }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
      </span>
    </div>
    <!--End shipping-->

    <!--Item col-->
    <div class="col-12 q-mt-lg">
      <q-markup-table class="shadow-0">
        <thead>
          <tr>
            <th class="text-left">Producto</th>
            <th class="text-right">Cantidad</th>
            <th class="text-right">Precio</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in order.items" :key="idx">
            <td>
              <p>{{ item.name || '' }} -
                <span>
                  {{ item.reference || '' }}
                </span>
              </p>
              <p>
                Ref. {{ item.variant.attribute || '' }}
              </p>
            </td>
            <td class="text-right">
              {{ item.quantity }}
            </td>
            <td class="text-right">
              {{ utils.formatPrice(item.purchasePrice) }}
            </td>
            <td class="text-right">
              {{ utils.formatPrice(item.total) }}
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
    <!--End items col-->

    <!--Total orders-->
    <div class="col-12 q-pr-md q-mt-lg text-right">
      <h2>
        Total: {{ utils.formatPrice(order.total) }}
      </h2>
    </div>
    <!--End total order-->
  </div>
</template>

<script lang="ts" setup>
// imports
import { Utils } from 'src/utils/utils'
import { defineProps, defineEmits } from 'vue'
import { OrderInterface } from 'src/interfaces/ordersInterface'

// props
const props = defineProps({
  order: {
    type: Object as () => OrderInterface,
    default: () => {
      return {}
    }
  }
})

// emits
const emit = defineEmits([
  'change-status'
])

// references
const utils = new Utils('orders')
const statusArray = [...new Set([
  "Pago Completado",
  "Pago en estado pendiente",
  "En proceso de pago",
  "Pago Rechazado",
  "Pago Cancelado",
  "Devolución de Fondos",
])];

// methods
const setOrderStatus = (status: string) => {
  emit('change-status', status, props.order._id)
}
</script>

<style scoped lang="scss">
h2 {
  font-size: 18px;
  font-weight: 600;
  line-height: 120%;
  padding-bottom: 12px;
}

span {
  font-size: 14px;
  font-weight: 400;
  line-height: 120%;

  a {
    color: $primary;
    text-decoration: none;
  }
}

.payment-span {
  display: inline-flex;
  align-items: center;
}

.span-chip {
  display: inline-block;
}
</style>
