<template>
    <q-page class="login-page">
        <MainComponents />
    </q-page>
</template>

<!-- eslint-disable space-before-function-paren -->
<script lang="ts">
import { defineComponent } from 'vue'
import MainComponents from 'src/components/dashboard/main.vue';

export default defineComponent({
    name: 'MainDashboardPage',
    components: {
        MainComponents
    },
    setup() {
        return {}
    }
})
</script>