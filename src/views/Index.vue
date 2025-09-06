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
          <div class="relative w-full h-screen flex items-center justify-center">
            <!-- Background image (blurred and darkened) -->
            <img
              :src="movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : fallbackImage"
              :alt="movie.title"
              class="absolute inset-0 w-full h-full object-cover filter blur-lg scale-105"
            />

            <div class="absolute inset-0 bg-black/60"></div>

           <!-- Foreground content -->
            <div class="relative z-10 w-11/12 md:w-4/5 lg:w-3/4 
             h-[50vh] md:h-[65vh] lg:h-[80vh] 
             bg-black/40 rounded-2xl overflow-hidden shadow-2xl ">
                <img
                :src="movie.poster_path ? `https://image.tmdb.org/t/p/w780${movie.poster_path}` : fallbackImage"
                :alt="movie.title"
                class="w-full h-full object-cover cursor-pointer"
                style="object-position: 50% 30%;"
                @click="handleMovieClick(movie)"
                />
             


              <!-- Gradient overlay -->
              <div class="absolute inset-0 bg-gradient-to-r from-black/100 via-black/60 to-transparent pointer-events-none"></div>

              
              <div class="absolute top-1/3 left-10 max-w-lg">
                
                  <h1 class="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-lg">
                  {{ movie.title }}
                  </h1>

                  <p class="text-sm sm:text-base md:text-lg text-gray-200 mb-5 line-clamp-3">
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
    </section>

    <!-- Movie Grid Section -->
    <section class="my-8">
      <!-- Trending Section -->
      <div class="mx-w-screen-2xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 xl:px-50">
        <h2 class="text-2xl font-bold text-white mb-4">Trending</h2>

        <!-- Scroll Row Wrapper -->
        <div class="relative">
          <!-- Scrollable Row -->
          <div
            ref="movieRow"
            class="flex overflow-x-auto scrollbar-hide scroll-smooth gap-6"
          >
            <!-- Movie Cards -->
            <div
              v-for="movie in movies.slice(0, 10)"
              :key="movie.id"
              class="w-[180px] h-[300px] sm:w-[200px] sm:h-[320px] lg:w-[220px] lg:h-[340px]
                 flex-shrink-0 movie-card rounded-lg overflow-hidden shadow hover:scale-105 transition cursor-pointer bg-black/40"
              @click="handleMovieClick(movie)"
            >
              <!-- Poster -->
              <img
              :src="movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : fallbackImage"
              :alt="movie.title"
              class="w-full h-[80%] object-cover"
              />

              <!-- Title  -->
              <div class="p-2 h-[20%] flex flex-col justify-between">
                <h3 class="font-bold text-sm sm:text-base truncate text-white">
                {{ movie.title }}
                </h3>
                <!-- <p class="text-gray-300 text-xs sm:text-sm">
                  ⭐ {{ movie.vote_average }} / 10
                </p> -->
              </div>
            </div>
          </div>

            <!-- Left Arrow -->
            <button
           @click="scrollRow('left')"
            class="absolute left-0 top-1/3 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition"
            >
            ◀
            </button>

            <!-- Right Arrow -->
            <button
            @click="scrollRow('right')"
            class="absolute right-0 top-1/3 bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition"
            >
            ▶
            </button>
        </div>
      </div>
    </section>

    <!-- Top Rated -->
<section class="my-12">
  <div class="max-w-screen-2xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24">
    <h2 class="text-2xl font-bold text-white mb-4">Top Rated</h2>
    <div class="flex overflow-x-auto scrollbar-hide gap-6">
      <div
        v-for="movie in topRated.slice(0, 10)"
        :key="movie.id"
        class="min-w-[180px] md:min-w-[200px] lg:min-w-[220px] flex-shrink-0 shadow rounded-lg overflow-hidden hover:scale-105 transition cursor-pointer"
        @click="handleMovieClick(movie)"
      >
        <img
          :src="movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : fallbackImage"
          :alt="movie.title"
          class="w-full h-64 object-cover"
        />

        <div class="p-2 h-[20%] flex flex-col justify-between">
                <h3 class="font-bold text-sm sm:text-base truncate text-white">
                {{ movie.title }}
                </h3>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Upcoming -->
<section class="my-12">
  <div class="max-w-screen-2xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24">
    <h2 class="text-2xl font-bold text-white mb-4">Upcoming</h2>
    <div class="flex overflow-x-auto scrollbar-hide gap-6">
      <div
        v-for="movie in upcoming.slice(0, 10)"
        :key="movie.id"
        class="min-w-[180px] md:min-w-[200px] lg:min-w-[220px] flex-shrink-0 shadow rounded-lg overflow-hidden hover:scale-105 transition cursor-pointer"
        @click="handleMovieClick(movie)"
      >
        <img
          :src="movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : fallbackImage"
          :alt="movie.title"
          class="w-full h-64 object-cover"
        />

        <div class="p-2 h-[20%] flex flex-col justify-between">
                <h3 class="font-bold text-sm sm:text-base truncate text-white">
                {{ movie.title }}
                </h3>
        </div>
      </div>
    </div>
  </div>
</section>

    <!-- Action -->
<section class="my-12">
  <div class="max-w-screen-2xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24">
    <h2 class="text-2xl font-bold text-white mb-4">Action Movies</h2>
    <div class="flex overflow-x-auto scrollbar-hide gap-6">
      <div
        v-for="movie in actionMovies.slice(0, 10)"
        :key="movie.id"
        class="min-w-[180px] md:min-w-[200px] lg:min-w-[220px] flex-shrink-0 shadow rounded-lg overflow-hidden hover:scale-105 transition cursor-pointer"
        @click="handleMovieClick(movie)"
      >
        <img
          :src="movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : fallbackImage"
          :alt="movie.title"
          class="w-full h-64 object-cover"
        />

        <div class="p-2 h-[20%] flex flex-col justify-between">
                <h3 class="font-bold text-sm sm:text-base truncate text-white">
                {{ movie.title }}
                </h3>
        </div>
      </div>
    </div>
  </div>
</section>

        <!-- Kdrama -->
<section class="my-12">
  <div class="max-w-screen-2xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24">
    <h2 class="text-2xl font-bold text-white mb-4">Kdrama</h2>
    <div class="flex overflow-x-auto scrollbar-hide gap-6">
      <div
        v-for="movie in kdrama.slice(0, 10)"
        :key="movie.id"
        class="min-w-[180px] md:min-w-[200px] lg:min-w-[220px] flex-shrink-0 shadow rounded-lg overflow-hidden hover:scale-105 transition cursor-pointer"
        @click="handleMovieClick(movie)"
      >
        <img
          :src="movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : fallbackImage"
          :alt="movie.title"
          class="w-full h-64 object-cover"
        />

        <div class="p-2 h-[20%] flex flex-col justify-between">
                <h3 class="font-bold text-sm sm:text-base truncate text-white">
                {{ movie.name }}
                </h3>
        </div>
      </div>
    </div>
  </div>
</section>

  </div>
</template>

<script>
  import { Carousel, Slide } from "vue3-carousel";
  import "vue3-carousel/dist/carousel.css";
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
          topRated: [],
          upcoming: [],
          actionMovies: [],
          kdrama: [],
          fallbackImage: 'https://via.placeholder.com/200x300?text=No+Image',
          apiKey: import.meta.env.VITE_TMDB_API_KEY,
          baseUrl: 'https://api.themoviedb.org/3',
          currentSlide: 0, 
        };
      },
      methods: {
        async fetchCarouselMovies() {
          try {
            const response = await axios.get(`${this.baseUrl}/movie/popular`, {
              params: { api_key: this.apiKey, language: 'en-US', page: 1 },
            });
            this.carouselMovies = response.data.results.slice(0, 10);
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
        async fetchTopRated() {
          try {
            const response = await axios.get(`${this.baseUrl}/movie/top_rated`, {
              params: { api_key: this.apiKey, language: 'en-US', page: 1 },
            });
            this.topRated = response.data.results;
          } catch (error) {
            console.error('Error fetching top rated movies:', error);
          }
        },
        async fetchUpcoming() {
          try {
            const response = await axios.get(`${this.baseUrl}/movie/upcoming`, {
              params: { api_key: this.apiKey, language: 'en-US', page: 1 },
            });
            this.upcoming = response.data.results;
          } catch (error) {
            console.error('Error fetching upcoming movies:', error);
          }
        },
        async fetchActionMovies() {
          try {
            const response = await axios.get(`${this.baseUrl}/discover/movie`, {
              params: { api_key: this.apiKey, with_genres: 28, language: 'en-US', page: 1 },
            });
            this.actionMovies = response.data.results;
          } catch (error) {
            console.error('Error fetching action movies:', error);
          }
        },
        async fetchKdrama() {
          try {
            const response = await axios.get(`${this.baseUrl}/discover/tv`, {
              params: { api_key: this.apiKey, with_genres: 18, with_original_language: 'ko', language: 'en-US', page: 1 },
            });
            this.kdrama = response.data.results;
          } catch (error) {
            console.error('Error fetching Kdrama:', error);
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
        scrollRow(direction) {
          const row = this.$refs.movieRow;
          if (!row) return;

          const scrollAmount = 300; 
          if (direction === 'left') {
            row.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
          } else {
            row.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        },
      },
      created() {
        this.fetchCarouselMovies();
        this.fetchMovies();
        this.fetchTopRated();
        this.fetchUpcoming();
        this.fetchActionMovies();
        this.fetchKdrama();
      },
    };
</script>

<style scoped>
.home-container {
  background: transparent;
}

.hero { position: relative; }

/* makes sure poster thumbnails don't stretch on very small screens
@media (max-width: 640px) {
  .hero .w-28 { width: 22vw; height: 12vw; }
} */

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;  
  scrollbar-width: none;  
}
</style>
