<template>
  <nav class="bg-transparent text-black p-4 flex justify-between items-center">
    <!-- Logo -->
    <div class="flex items-center h-16 w-32">
      <img src="../assets/cf.png" alt="Logo" />
    </div>

    <!-- Links (show only if logged in) -->
    <div v-if="isLoggedIn">
      <ul class="flex space-x-6">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/movies">Movies</router-link></li>
        <li><router-link to="/tv-shows">TV Shows</router-link></li>
        <li><router-link to="/my-list">My List</router-link></li>
        <li>
          <button
            @click="$emit('logout')"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>

    <!-- Login Button (if not logged in) -->
    <button
      v-else
      @click="showModal = true"
      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
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
    };
  },
  methods: {
    onLogin({ token }) {
      this.$emit("login", token); // pass token up to App.vue
      this.showModal = false;
    },
  },
};
</script>
