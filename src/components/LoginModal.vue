<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <!-- Glassmorphism Card -->
    <div
      class="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg w-full max-w-sm p-6 text-white"
    >
      <!-- Floating User Icon -->
      <div
        class="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/30"
      >
        <img 
        src="@/assets/user.png" 
        alt="User Icon"
        class="w-10 h-10"
        />

      </div>

      <h2 class="text-2xl font-bold text-center mt-12 mb-6">Login</h2>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email Input -->
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 12H8m0 0l4-4m-4 4l4 4"
              />
            </svg>
          </span>
          <input
            v-model="email"
            type="email"
            placeholder="Email ID"
            class="w-full pl-10 pr-3 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40"
          />
        </div>

        <!-- Password Input -->
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3m12 0c0-1.657-1.343-3-3-3s-3 1.343-3 3m0 0v4m-6 0v-4m6 4v2m-6-2v2m0-6a9 9 0 0118 0"
              />
            </svg>
          </span>
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full pl-10 pr-3 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/40"
          />
        </div>

        <!-- Error -->
        <div v-if="error" class="text-red-400 text-sm">{{ error }}</div>

        <!-- Remember me + Forgot Password -->
        <div class="flex items-center justify-between text-sm text-gray-300">
          <label class="flex items-center space-x-2">
            <input type="checkbox" class="accent-white/70" />
            <span>Remember me</span>
          </label>
          <a href="#" class="hover:underline">Forgot Password?</a>
        </div>

        <!-- Buttons -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-white/20 border border-white/40 text-white font-semibold rounded-lg hover:bg-white/30 transition disabled:opacity-50"
        >
          {{ loading ? "Logging in..." : "LOGIN" }}
        </button>

        <button
          @click="$emit('close')"
          type="button"
          class="w-full mt-3 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
        >
          Cancel
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import reqresApi from "../services/api";

export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      email: "",
      password: "",
      error: "",
      loading: false,
    };
  },
  methods: {
    async handleLogin() {
      if (!this.email || !this.password) {
        this.error = "Please enter email and password";
        return;
      }

      this.loading = true;
      this.error = "";

      try {
        const response = await reqresApi.post(
          "https://reqres.in/api/login",
          {
            email: this.email,
            password: this.password,
          },
          {
            headers: {
              "x-api-key": "reqres-free-v1",
            },
          }
        );

        localStorage.setItem("token", response.data.token);

        this.$emit("login", { token: response.data.token });
        this.email = "";
        this.password = "";
      } catch (error) {
        this.error =
          error.response?.data?.error || "Login failed. Please try again.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
