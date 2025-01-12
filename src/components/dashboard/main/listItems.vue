<template>
  <q-scroll-area style="width: 100%; height: 520px">
    <q-list class="recently">
      <q-item class="q-pa-none" v-for="(item, idx) in items" :key="idx" :class="{ 'q-mt-lg': idx > 0 }">
        <q-item-section avatar class="q-pa-none">
          <q-img class="list-img" :src="getBannerUrl(idx)"></q-img>
        </q-item-section>
        <q-item-section class="q-px-sm">
          <q-item-label>
            <q-icon v-if="showBrandIcon" style="margin-top: -2px" size="16pt" :name="`img:${item.brand_icon}`"></q-icon>
            <span class="product-title" :class="{ 'q-pl-sm': showBrandIcon }">{{ item.name }}</span>
          </q-item-label>
          <q-item-label class="q-px-xs q-pt-xs">
            <div class="chip-section">
              <div class="chip" :class="{ 'news': item.state === 'Nueva', 'used': item.state !== 'Nueva' }">
                {{ item.state }}
              </div>
              <div class="chip chip-category">
                {{ item.category }}
              </div>
            </div>
          </q-item-label>
          <q-item-label class="q-pt-xs">
            <span class="product-price q-pl-xs">
              {{ $utils.formatPrice(item.price) }}
            </span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-scroll-area>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RecentlyItemsInterface } from 'src/interfaces/dashboardInterface';

export default defineComponent({
  name: 'ListRecentlyComponents',
  props: {
    items: {
      type: Array as () => RecentlyItemsInterface[],
      default: () => []
    },
    showBrandIcon: {
      type: Boolean,
      default: () => true
    }
  },
  setup(props) {
    // data
    const itemsTypeLabel: any = {
      new: 'Nuevo',
      used: 'Usado'
    }

    const getBannerUrl = (idx: number): string => {
      const { banner } = props.items[idx];
      if (banner) {
        let url = '';
        const mobileBanner = banner.find((banner: ProductsBanners) => banner.type_banner === 'mobile')
        if (mobileBanner) {
          url = mobileBanner.path
        } else {
          const desktopBanner = banner.find((banner: ProductsBanners) => banner.type_banner === 'desktop')
          if (desktopBanner) {
            url = desktopBanner.path
          }
        }
        return url;
      }
    }

    return {
      itemsTypeLabel,
      getBannerUrl
    }
  }
})
</script>
