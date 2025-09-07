<template>
  <nav class="fixed top-0 w-full  bg-transparent  text-black p-4 flex justify-between items-center z-50 px-6">
    <!-- Logo -->
    <div class="flex items-center h-16 w-32  p-4">
      <img src="../assets/cf-red2.png" alt="Logo"/>
    </div>
    
    <!-- Links (show only if logged in) -->
    <div v-if="isLoggedIn">
      <ul class="flex space-x-6 text-white ">
        <li>
          <router-link to="/" class="px-4 py-2 rounded-lg hover:bg-red-700">Home</router-link>
        </li>
        <li>
          <router-link to="/movies" class="px-4 py-2 rounded-lg hover:bg-red-700">Movies</router-link>
        </li>
        <li>
          <router-link to="/tv-shows" class="px-4 py-2 rounded-lg hover:bg-red-700">TV Shows</router-link>
        </li>
        <li>
          <router-link to="/my-list" class="px-4 py-2 rounded-lg hover:bg-red-700">My List</router-link>
        </li>

        
          <button
            @click="$emit('logout')"
            class="bg-re hover:bg-red-700 text-white px-4 py-2 rounded-lg "
          >
            Logout
          </button>
        
      </ul>
    </div>

    <!-- Login Button (if not logged in) -->
    <button
      v-else
      @click="showModal = true"
      class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded  cursor-pointer"
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