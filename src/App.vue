<template>
  <div class="min-h-screen bg-black/100 text-white">
    <NavbarHome 
    
       :is-logged-in="authStore.isLoggedIn"
       @login="handleLogin"
       @logout="handleLogout"
    />

    <div v-if="message" class="bg-red-500 text-white p-3 text-center">
      {{ message }}
    </div>

    <TrailerModal />

    <router-view />
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import NavbarHome from '@/components/NavbarHome.vue';
import TrailerModal from './components/TrailerModal.vue';

export default {
  components: {
    
    NavbarHome,
    TrailerModal,
  },
  computed: {
    ...mapStores(useAuthStore),
    message() {
      return this.$data.message;
    },
  },
  data() {
    return {
      message: '',
    };
  },
  watch: {
    '$route.path'(newPath) {
      const msg = localStorage.getItem('redirectMessage');
      if (msg) {
        this.message = msg;
        localStorage.removeItem('redirectMessage');
        setTimeout(() => {
          this.message = '';
        }, 3000);
      }
    },
  },
  methods: {
    handleLogin(token) {
      this.authStore.login(token);
      this.$router.push('/movies');
    },
    handleLogout() {
      this.authStore.logout();
      this.$router.push('/');
    },
  },
};
</script>