<template>
  <q-scroll-area style="width: 100%; height: 520px">
    <q-list class="recently">
      <q-item class="q-pa-none" v-for="(item, idx) in items" :key="idx" :class="{ 'q-mt-lg': idx > 0 }">
        <q-item-section avatar class="q-pa-none">
          <q-img class="list-img" :src="item.img"></q-img>
        </q-item-section>
        <q-item-section class="q-px-sm">
          <q-item-label>
            <q-icon style="margin-top: -2px" size="16pt" name="img:images/yamaha.svg"></q-icon>
            <span class="product-title q-pl-sm">{{ item.name }}</span>
          </q-item-label>
          <q-item-label class="q-px-xs">
            <div class="chip-section">
              <div class="chip" :class="{ 'news': item.item_type === 'new', 'used': item.item_type === 'used' }">
                {{ itemsTypeLabel[item.item_type] }}
              </div>
              <div class="chip chip-category">
                {{ item.category }}
              </div>
            </div>
          </q-item-label>
          <q-item-label>
            <q-icon style="margin-top: -2px" size="16pt" name="img:images/yamaha.svg"></q-icon>
            <span class="product-title q-pl-sm">Nombre motocicleta</span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RecentlyItemsInterface } from 'src/interfaces/DashboardInterface';

export default defineComponent({
  name: 'ListRecentlyComponents',
  props: {
    items: {
      type: Array as () => RecentlyItemsInterface[],
      default: () => []
    }
  },
  setup() {
    // data
    const itemsTypeLabel: any = {
      new: 'Nueva',
      used: 'Usada'
    }

    return {
      itemsTypeLabel
    }
  }
})
</script>
