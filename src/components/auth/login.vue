<template>
  <section class="bg-login">
    <div class="row full-height mobile-bg">
      <div class="col-12 col-md-5 col-lg-6 d-flex justify-center items-center">
        <div class="overflow"></div>
        <section class="login-row">
          <q-img class="logo" src="images/logo.svg" alt="Motowork logo"></q-img>
          <span class="title-login">
            administra <span class="text-secondary">moto work</span> como un experto
          </span>
          <span class="subtitle-login">
            Toma el control de y eleva tu negocio a nuevas alturas.
          </span>
          <q-form @submit="doLogin" class="full-width row">
            <div class="col-12">
              <label :for="login.username">
                Usuario
              </label>
              <q-input :rules="[(val) => !!val || 'Ingresa este campo']" bg-color="accent" v-model="login.username"
                square dense outlined class="q-mt-xs" placeholder="Ingresa tu usuario"></q-input>
            </div>
            <div class="col-12">
              <label :for="login.username">
                Contraseña
              </label>
              <q-input type="password" :rules="[
                (val) => !!val || 'Ingresa este campo',
                (val) => val.length >= 8 || 'Debe tener minimo 8 caracteres',
                (val) => /[A-Z]/.test(val) || 'Debe contener una letra mayúscula',
                (val) => /[a-z]/.test(val) || 'Debe contener una letra minúscula',
                (val) => /\d/.test(val) || 'Debe contener un número',
                (val) => /[$@#&!*-]/.test(val) || 'Debe contener uno de estos caracteres $, @, #, &, *, -, !'
              ]" bg-color="accent" v-model="login.password" square dense outlined class="q-mt-xs"
                placeholder="Ingresa tu contraseña"></q-input>
            </div>
            <div class="col-12">
              <q-checkbox @update:model-value="doRemember" color="secondary" bg-color="white" v-model="rememberPassword"
                label="Recordar contraseña" />
            </div>
            <div class="col-12 q-mt-xl">
              <q-btn unelevated square :loading="loading" type="submit" class="full-width submit-btn" color="secondary"
                label="Iniciar sesión"></q-btn>
            </div>
          </q-form>
        </section>
      </div>
      <div class="col-12 col-md-7 col-lg-6 full-height hide-mobile">
        <q-img src="images/loginbg.svg" class="login-img" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { useRouter } from 'vue-router'
import { defineComponent, onBeforeMount, ref } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { LoginData } from 'src/interfaces/authInterface'
import { StorageService } from 'src/utils/storage'

export default defineComponent({
  name: 'LoginComponent',
  setup() {
    // data
    const login = ref<LoginData>({
      password: '',
      username: ''
    })
    const router = useRouter()
    const authStore = useAuthStore()
    const loading = ref<boolean>(false)
    const storage = new StorageService('auth')
    const rememberPassword = ref<boolean>(false)

    // methods
    const doLogin = async (): Promise<void> => {
      try {
        loading.value = true
        login.value.remember = rememberPassword.value ?? false
        const response = await authStore.doLogin(login.value);
        if (response?.success) {
          router.push({
            name: 'dashboard'
          })
        }
      } catch (error) {
      } finally {
        loading.value = false
      }
    }

    const doRemember = (val: boolean) => {
      if (val) {
        storage.saveInStorage('local', 'rememberPassword', val)
      } else {
        storage.deleteItemStorage('local', 'rememberPassword')
      }
    }

    // hook
    onBeforeMount(() => {
      const hasRemember = storage.getItemStorage('local', 'rememberPassword') || false
      if (hasRemember) {
        rememberPassword.value = hasRemember
      }
    })

    return {
      login,
      doLogin,
      loading,
      doRemember,
      rememberPassword
    }
  }
})
</script>
