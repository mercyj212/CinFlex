<template>
  <nav
    class="absolute top-0 w-full bg-transparent text-white p-4 flex items-center justify-between z-50 px-6"
  >
    <!-- Logo -->
    <div class="flex items-center h-16 w-32 p-2">
      <img src="../assets/cf-red2.png" alt="Logo" />
    </div>

    <!-- Center Search Bar (only when logged in) -->
    <div v-if="isLoggedIn" class="flex-1 flex justify-center px-6 relative">
      <div class="relative w-full max-w-lg">
        <input
          v-model="query"
          type="text"
          placeholder="Search movies..."
          class="w-full py-3 pl-5 pr-12 mb-4
                 rounded-full text-white placeholder-gray-400
                 bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e]
                 shadow-[0_0_15px_rgba(255,255,255,0.2)]
                 focus:outline-none focus:ring-2 focus:ring-white-500"
          @input="debouncedSearch"
        />
        <button
          @click="handleSearch"
          class="absolute right-3 top-1/2 -translate-y-1/2
                 p-2 mb-8 rounded-full bg-red-600 hover:bg-red-700 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
            />
          </svg>
        </button>
      </div>

      <!-- Dropdown Results -->
      <div
        v-if="results.length"
        class="absolute top-14 w-full max-w-lg bg-black/90 rounded-lg shadow-lg mt-2 max-h-80 overflow-y-auto z-50"
      >
        <ul>
          <li
            v-for="item in results"
            :key="item.id"
            @click="selectResult(item)"
            class="flex items-center gap-3 px-4 py-2 hover:bg-red-700 cursor-pointer"
          >
            <img
              v-if="item.poster_path"
              :src="`https://image.tmdb.org/t/p/w92${item.poster_path}`"
              class="w-10 h-14 object-cover rounded"
            />
            <span class="text-sm font-medium">
              {{ item.title || item.name }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Logged-in block (hamburger + dropdown) -->
    <div v-if="isLoggedIn" class="relative">
      <button @click="toggleMenu" class="text-white  focus:outline-none">
        <svg
          v-if="!menuOpen"
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 hover:bg-red-600 rounded"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- Dropdown Menu -->
      <transition name="fade">
        <div
          v-if="menuOpen"
          class="absolute top-16 right-6 bg-black/90 rounded-lg shadow-lg w-48 p-4 space-y-3"
        >
          <router-link
            to="/"
            class="block px-4 py-2 rounded hover:bg-red-700"
            @click="closeMenu"
            >Home</router-link
          >
          <router-link
            to="/movies"
            class="block px-4 py-2 rounded hover:bg-red-700"
            @click="closeMenu"
            >Movies</router-link
          >
          <router-link
            to="/tv-shows"
            class="block px-4 py-2 rounded hover:bg-red-700"
            @click="closeMenu"
            >TV Shows</router-link
          >
          <router-link
            to="/my-list"
            class="block px-4 py-2 rounded hover:bg-red-700"
            @click="closeMenu"
            >My List</router-link
          >

          <button
            @click="logoutAndClose"
            class="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </transition>
    </div>

    <!-- Login Button -->
    <button
      v-else
      @click="showModal = true"
      class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
    >
      Login
    </button>

    <!-- Login Modal -->
    <LoginModal :show="showModal" @login="onLogin" @close="showModal = false" />
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
      query: "",
      results: [],
      searchTimeout: null,
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
    },
    async handleSearch() {
      if (!this.query.trim()) {
        this.results = [];
        return;
      }
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${
            import.meta.env.VITE_TMDB_API_KEY
          }&query=${encodeURIComponent(this.query)}&language=en-US`
        );
        const data = await res.json();
        this.results = data.results || [];
      } catch (err) {
        console.error("Search failed:", err);
      }
    },
    debouncedSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(this.handleSearch, 400);
    },
    selectResult(item) {
      this.$emit("select", item);
      this.results = [];
      this.query = "";
    },
  },
  watch: {
    $route() {
      this.menuOpen = false;
    },
  },
};
</script>
