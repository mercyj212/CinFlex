<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">🎬 Popular Movies</h1>

    <div v-if="loading">Loading movies...</div>
    <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      <div
        v-for="movie in movies"
        :key="movie.id"
        class="bg-white shadow rounded-lg overflow-hidden hover:scale-105 transition"
      >
        <img
          :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
          alt="Movie Poster"
          class="w-full h-72 object-cover"
        />
        <div class="p-4">
          <h2 class="font-bold text-lg truncate">{{ movie.title }}</h2>
          <p class="text-gray-600 text-sm">
            ⭐ {{ movie.vote_average }} / 10
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      movies: [],
      loading: true,
    };
  },
  async created() {
    try {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
      );
      this.movies = res.data.results;
    } catch (err) {
      console.error("Error fetching movies:", err);
    } finally {
      this.loading = false;
    }
  },
};
</script>
