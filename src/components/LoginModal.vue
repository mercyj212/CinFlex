<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <!-- Movie Info -->
      <div v-if="movie" class="mb-4">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {{ movie.title || movie.name }}
        </h2>
        
        <p class="text-gray-700 dark:text-gray-300 text-sm line-clamp-4">
           {{ movie.overview || "No description available." }}
        </p>
    

      </div>

      <h2 class="text-2xl mb-4">Login</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            class="mt-1 w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your Email"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            class="mt-1 w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your Password"
          />
        </div>

        <div v-if="error" class="text-red-600 text-sm mb-4">{{ error }}</div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
          <button
            @click="$emit('close')"
            type="button"
            class="ml-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import reqresApi from '../services/api';

export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      email: '',
      password: '',
      error: '',
      loading: false,
    };
  },
  methods: {
    async handleLogin() {
      if (!this.email || !this.password) {
        this.error = 'Please enter email and password';
        return;
      }

      this.loading = true;
      this.error = '';

      try {
        const response = await reqresApi.post('https://reqres.in/api/login', {
          email: this.email,
          password: this.password,
        },

        {
            headers: {
                'x-api-key': 'reqres-free-v1'
            
               }
        }
    );
         // save token
            localStorage.setItem('token', response.data.token);

         this.$emit('login', { token: response.data.token });
         this.email = '';
         this.password = '';
      } catch (error) {
        this.error = error.response?.data?.error || 'Login failed. Please try again.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>