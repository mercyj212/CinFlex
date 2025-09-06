<template>
  <div class="home-container">
    <!-- HERO / Carousel -->
    <section class="hero relative min-h-screen overflow-hidden">
      <!-- Main carousel -->
      <Carousel
        ref="heroCarousel"
        :autoplay="4000"
        :wrap-around="true"
        class="h-screen"
        @slide-end="onSlideEnd"
      >
        <Slide v-for="(movie, index) in carouselMovies" :key="movie.id ?? index">
          <div class="relative w-full h-screen overflow-hidden">
            <!-- Background image (blurred and darkened) -->
            <img
              :src="movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : fallbackImage"
              :alt="movie.title"
              class="absolute inset-0 w-full h-full object-cover filter blur- scale-105"
            />

           <!-- Foreground content
            <div class="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-4">
                <img
                :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : fallbackImage"
                :alt="movie.title"
                class="w-5/6 md:w-3/4 lg:w-2/3 h-80 md:h-80 object-cover rounded-xl shadow-2xl mb-6"
                @click="handleMovieClick(movie)"
                />
            </div> -->


            <!-- Left-to-right gradient to keep text readable -->
            <div class="absolute inset-0 bg-gradient-to-r from-black/100 via-black/60 to-transparent pointer-events-none"></div>

            <!--  Left content box (title, description, CTA) aligned to left like your screenshot -->
            <div class="relative z-20 h-full flex items-center">
              <div class="px-10 lg:px-16 max-w-xl text-left text-white">
                <h1 class="text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
                  {{ movie.title }}
                </h1>

                <p class="text-base md:text-lg text-gray-200 mb-5 line-clamp-3">
                  {{ movie.overview || "No description available." }}
                </p>

                <div class="flex items-center gap-4">
                  <button
                    @click="handleMovieClick(movie)"
                    class="flex items-center gap-3 px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 transition-shadow"
                  >
                    <!-- small SVG play icon -->
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 3v18l15-9L5 3z" fill="#fff"></path>
                    </svg>
                    <span class="font-medium">Watch Trailer</span>
                  </button>

                  <button class="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition">
                    More info
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Slide>
      </Carousel>

      <!-- Centered Prev/Next arrows (overlayed, clickable) -->
      <div class="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex items-center justify-between px-6 z-30 pointer-events-none">
        <button
          @click="prev()"
          class="pointer-events-auto w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
          aria-label="Previous"
        >
          ‹
        </button>

        <button
          @click="next()"
          class="pointer-events-auto w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
          aria-label="Next"
        >
          ›
        </button>
      </div>

      <!-- Thumbnail row (small posters) centered at bottom -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex items-center gap-4">
        <div
          v-for="(movie, i) in carouselMovies"
          :key="movie.id ?? i"
          @click="goToSlide(i)"
          class="w-28 md:w-20 h-16  overflow-hidden rounded-md cursor-pointer border-2 transition-shadow"
          :class="i === currentSlide ? 'ring-2 ring-white scale-105' : 'ring-0 opacity-80 hover:opacity-100'"
        >
          <img
            :src="movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : (movie.backdrop_path ? `https://image.tmdb.org/t/p/w300${movie.backdrop_path}` : fallbackImage)"
            :alt="movie.title"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>

    <!-- Movie Grid Section (unchanged) -->
    <section class="my-8 px-4">
      <h2 class="text-2xl font-bold text-white mb-4">Now Playing</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <div
          v-for="movie in movies"
          :key="movie.id"
          class="movie-card shadow rounded-lg overflow-hidden hover:scale-105 transition"
          @click="handleMovieClick(movie)"
        >
          <img
            :src="movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : fallbackImage"
            :alt="movie.title"
            class="w-full h-64 object-cover"
          />
          <div class="p-4">
            <h3 class="font-bold text-base truncate text-white">{{ movie.title }}</h3>
            <p class="text-gray-300 text-sm">⭐ {{ movie.vote_average }} / 10</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide } from "vue3-carousel";
import { mapStores } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import NavbarHome from '@/components/NavbarHome.vue';

export default {
  components: { Carousel, Slide, NavbarHome },
  computed: {
    ...mapStores(useAuthStore),
  },
  data() {
    return {
      carouselMovies: [],
      movies: [],
      fallbackImage: 'https://via.placeholder.com/200x300?text=No+Image',
      apiKey: import.meta.env.VITE_TMDB_API_KEY,
      baseUrl: 'https://api.themoviedb.org/3',
      currentSlide: 0, // tracks which slide is active (used to highlight thumbnail)
    };
  },
  methods: {
    async fetchCarouselMovies() {
      try {
        const response = await axios.get(`${this.baseUrl}/movie/popular`, {
          params: { api_key: this.apiKey, language: 'en-US', page: 1 },
        });
        this.carouselMovies = response.data.results.slice(0, 5);
      } catch (error) {
        console.error('Error fetching carousel movies:', error);
      }
    },
    async fetchMovies() {
      try {
        const response = await axios.get(`${this.baseUrl}/movie/now_playing`, {
          params: { api_key: this.apiKey, language: 'en-US', page: 1 },
        });
        this.movies = response.data.results;
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    },

    // called when the carousel finishes sliding; payload from vue3-carousel includes currentSlideIndex
    onSlideEnd(payload) {
      if (payload && typeof payload.currentSlideIndex !== 'undefined') {
        this.currentSlide = payload.currentSlideIndex;
      }
    },

    // use the carousel API (ref) to jump to a specific slide
    goToSlide(index) {
      if (this.$refs.heroCarousel && typeof this.$refs.heroCarousel.slideTo === 'function') {
        this.$refs.heroCarousel.slideTo(index);
      }
    },

    prev() {
      if (this.$refs.heroCarousel && typeof this.$refs.heroCarousel.prev === 'function') {
        this.$refs.heroCarousel.prev();
      }
    },

    next() {
      if (this.$refs.heroCarousel && typeof this.$refs.heroCarousel.next === 'function') {
        this.$refs.heroCarousel.next();
      }
    },

    handleMovieClick(movie) {
      if (!this.authStore.isLoggedIn) {
        localStorage.setItem('redirectMessage', 'Please log in first before continuing.');
        this.$router.push('/');
      } else {
        this.$router.push({ path: '/movies', query: { movieId: movie.id } });
      }
    },
  },
  created() {
    this.fetchCarouselMovies();
    this.fetchMovies();
  },
};
</script>

<style scoped>
.home-container {
  background: transparent;
}

.hero { position: relative; }

/* make sure poster thumbnails don't stretch on very small screens */
@media (max-width: 640px) {
  .hero .w-28 { width: 22vw; height: 12vw; }
}
</style>
