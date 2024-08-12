<template>
  <q-page class="login-page">
    <Login />
  </q-page>
</template>

<!-- eslint-disable space-before-function-paren -->
<script lang="ts">
import { defineComponent } from 'vue'
import Login from 'src/components/auth/login.vue';

export default defineComponent({
  name: 'IndexPage',
  components: {
    Login
  },
  setup() {
    return {}
  }
})
</script>
