<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero relative min-h-screen overflow-hidden mb-8">
      <Carousel
        ref="heroCarousel"
        :autoplay="5000"
        :wrap-around="true"
        class="h-screen"
        @slide-end="onSlideEnd"
      >
        <Slide v-for="(movie, index) in carouselMovies" :key="movie.uid ?? index">
          <div class="relative w-full h-screen flex items-center justify-center">
            <!-- Background -->
            <img
              :src="movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : fallbackImage"
              :alt="movie.title"
              class="absolute inset-0 w-full h-full object-cover filter blur-lg scale-105"
            />
            <div class="absolute inset-0 bg-black/60"></div>

            <!-- Foreground -->
            <div
              class="relative z-10 w-11/12 md:w-4/5 lg:w-3/4
                     h-[50vh] md:h-[65vh] lg:h-[80vh]
                     bg-black/40 rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                :src="movie.poster_path ? `https://image.tmdb.org/t/p/w780${movie.poster_path}` : fallbackImage"
                :alt="movie.title"
                class="w-full h-full object-cover cursor-pointer"
                style="object-position: 50% 30%;"
              />

              <!-- Gradient -->
              <div class="absolute inset-0 bg-gradient-to-r from-black/100 via-black/60 to-transparent"></div>

              <!-- Text -->
              <div class="absolute top-1/3 left-10 max-w-lg">
                <h1 class="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-4 text-white">
                  {{ movie.title }}
                </h1>

                <p class="text-sm sm:text-base md:text-lg text-gray-200 mb-5 line-clamp-3">
                  {{ movie.overview || 'No description available.' }}
                </p>

                <div class="flex items-center gap-4">
                  <button
                    @click="openTrailer(movie.original_id, movie.content_type)"
                    class="flex items-center gap-3 px-6 py-3 rounded-full bg-red-600 hover:bg-red-700"
                  >
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M5 3v18l15-9L5 3z" fill="#fff"></path>
                    </svg>
                    <span class="font-medium">Watch Trailer</span>
                  </button>

                  <button class="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20">
                    More info
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Slide>
      </Carousel>

      <!-- Prev/Next -->
      <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-6 z-30 pointer-events-none">
        <button
          @click="prev"
          class="pointer-events-auto w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60"
        >
          ‹
        </button>
        <button
          @click="next"
          class="pointer-events-auto w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60"
        >
          ›
        </button>
      </div>
    </section>

    <!-- Popular Movies Grid -->
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
            :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : fallbackImage"
            alt="Movie Poster"
            class="w-full h-72 object-cover"
          />
          <div class="p-4">
            <h2 class="font-bold text-lg truncate">{{ movie.title }}</h2>
            <p class="text-gray-600 text-sm">⭐ {{ movie.vote_average }} / 10</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Trailer Modal -->
    <TrailerModal
      v-if="selectedMovieId"
      :movieId="selectedMovieId"
      :mediaType="selectedMediaType"
      :isOpen="isTrailerOpen"
      @close="isTrailerOpen = false"
    />
  </div>
</template>

<script>
import { Carousel, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import TrailerModal from "../components/TrailerModal.vue";
import axios from "axios";

export default {
  components: { Carousel, Slide, TrailerModal },

  data() {
    return {
      movies: [], // popular movies grid
      carouselMovies: [], // hero section (mix of movies + kdramas)
      selectedMovieId: null,
      selectedMediaType: null,
      isTrailerOpen: false,
      loading: true,
      fallbackImage: "https://via.placeholder.com/200x300?text=No+Image",
      apiKey: import.meta.env.VITE_TMDB_API_KEY,
      baseUrl: "https://api.themoviedb.org/3",
      currentSlide: 0,
    };
  },

  methods: {
    async fetchPopularMovies() {
      try {
        const res = await axios.get(`${this.baseUrl}/movie/popular`, {
          params: { api_key: this.apiKey, language: "en-US", page: 1 },
        });
        this.movies = res.data.results || [];
        return res.data.results || [];
      } catch (err) {
        console.error("Error fetching popular movies:", err);
        return [];
      }
    },

    async fetchKdrama() {
      try {
        const res = await axios.get(`${this.baseUrl}/discover/tv`, {
          params: {
            api_key: this.apiKey,
            with_original_language: "ko",
            language: "en-US",
            page: 1,
          },
        });
        return res.data.results || [];
      } catch (err) {
        console.error("Error fetching Kdrama:", err);
        return [];
      }
    },

    normalizeMovie(m) {
      return {
        uid: `movie-${m.id}`,
        original_id: m.id,
        content_type: "movie",
        title: m.title || "Untitled",
        poster_path: m.poster_path,
        backdrop_path: m.backdrop_path,
        overview: m.overview,
        vote_average: m.vote_average,
      };
    },

    normalizeTv(t) {
      return {
        uid: `tv-${t.id}`,
        original_id: t.id,
        content_type: "tv",
        title: t.name || "Untitled",
        poster_path: t.poster_path,
        backdrop_path: t.backdrop_path,
        overview: t.overview,
        vote_average: t.vote_average,
      };
    },

    shuffleArray(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },

    async buildCarousel() {
      const [popular, kdrama] = await Promise.all([
        this.fetchPopularMovies(),
        this.fetchKdrama(),
      ]);
      const normalizedMovies = (popular || []).map(this.normalizeMovie);
      const normalizedTv = (kdrama || []).map(this.normalizeTv);
      const combined = this.shuffleArray(normalizedMovies.concat(normalizedTv));
      this.carouselMovies = combined.slice(0, 10);
    },

    onSlideEnd(payload) {
      if (payload && typeof payload.currentSlideIndex !== "undefined") {
        this.currentSlide = payload.currentSlideIndex;
      }
    },

    prev() {
      this.$refs.heroCarousel?.prev();
    },
    next() {
      this.$refs.heroCarousel?.next();
    },

    openTrailer(id, type) {
      this.selectedMovieId = id;
      this.selectedMediaType = type;
      this.isTrailerOpen = true;
    },
  },

  async created() {
    await this.buildCarousel();
    this.loading = false;
  },
};
</script>

<style>
.home-container {
  background: transparent;
}
.hero {
  position: relative;
}
</style>
