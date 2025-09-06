<template>
  <nav class="fixed top-0 w-full  bg-transparent  text-black p-4 flex justify-between items-center z-50 px-6">
    <!-- Logo -->
    <div class="flex items-center h-16 w-32  p-4">
      <img src="../assets/cf-red2.png" alt="Logo"/>
      <!-- <p>CinFlex</p>  -->
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
      class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mr-50 cursor-pointer"
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