<template>
  <div class="min-h-screen bg-black/100 text-white">
    <NavbarHome 
      :is-logged-in="authStore.isLoggedIn"
      @login="handleLogin"
      @logout="handleLogout"
      @select="openInfoModal"
    />

    <div v-if="message" class="bg-red-500 text-white p-3 text-center">
      {{ message }}
    </div>

    <TrailerModal />

    
    <InfoModal
      v-if="showInfo"
      :movieId="selectedMovie?.id"
      :type="selectedMovie?.media_type || 'movie'"
      :isOpen="showInfo"
      @close="closeInfoModal"
    />

    <router-view />
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import NavbarHome from '@/components/NavbarHome.vue';
import TrailerModal from './components/TrailerModal.vue';
import InfoModal from './components/InfoModal.vue';

export default {
  components: {
    NavbarHome,
    TrailerModal,
    InfoModal,
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
      selectedMovie: null,  // ✅ holds clicked movie
      showInfo: false       // ✅ controls modal visibility
    };
  },
  watch: {
    '$route.path'() {
      const msg = localStorage.getItem('redirectMessage');
      if (msg) {
        this.message = msg;
        localStorage.removeItem('redirectMessage');
        setTimeout(() => (this.message = ''), 3000);
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
    // ✅ Called when Navbar/search emits @select
    openInfoModal(item) {
      console.log("Movie clicked:", item);
      this.selectedMovie = item;
      this.showInfo = true;
    },
    closeInfoModal() {
      this.showInfo = false;
      this.selectedMovie = null;
    }
  },
};
</script>
