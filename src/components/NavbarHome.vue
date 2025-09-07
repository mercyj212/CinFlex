<template>
  <nav class="fixed top-0 w-full bg-transparent  text-white p-4 flex justify-between items-center z-50 px-6">
    <!-- Logo -->
    <div class="flex items-center h-16 w-32 p-2">
      <img src="../assets/cf-red2.png" alt="Logo" />
    </div>

    <!-- Logged-in block (hamburger + dropdown) -->
    <div v-if="isLoggedIn" class="relative">
      <!-- Hamburger Button (always visible for logged-in users) -->
      <button @click="toggleMenu" class="text-white focus:outline-none">
        <svg v-if="!menuOpen" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <!-- Dropdown Menu -->
      <transition name="fade">
        <div 
          v-if="menuOpen" 
          class="absolute top-16 right-6 bg-black/90 rounded-lg shadow-lg w-48 p-4 space-y-3"
        >
          <router-link to="/" class="block px-4 py-2 rounded hover:bg-red-700" @click="closeMenu">Home</router-link>
          <router-link to="/movies" class="block px-4 py-2 rounded hover:bg-red-700" @click="closeMenu">Movies</router-link>
          <router-link to="/tv-shows" class="block px-4 py-2 rounded hover:bg-red-700" @click="closeMenu">TV Shows</router-link>
          <router-link to="/my-list" class="block px-4 py-2 rounded hover:bg-red-700" @click="closeMenu">My List</router-link>

          <button
            @click="logoutAndClose"
            class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </transition>
    </div>

    <!-- Login Button (shown when not logged in) -->
    <button
      v-else
      @click="showModal = true"
      class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
    >
      Login
    </button>

    <!-- Login Modal -->
    <LoginModal
      :show="showModal"
      @login="onLogin"
      @close="showModal = false"
    />
  </nav>
</template>

<script>
import LoginModal from "./LoginModal.vue";

export default {
  props: {
    isLoggedIn: Boolean,
  },
  components: {
    LoginModal,
  },
  data() {
    return {
      showModal: false,
      menuOpen: false,
    };
  },
  methods: {
    onLogin({ token }) {
      this.$emit("login", token);
      this.showModal = false;
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    closeMenu() {
      this.menuOpen = false;
    },
    logoutAndClose() {
      this.$emit("logout");
      this.menuOpen = false;
    }
  },
  watch: {
    // optional: close menu on route change
    $route() {
      this.menuOpen = false;
    }
  }
};
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
