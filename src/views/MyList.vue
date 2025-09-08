<template>
  <div class="tvshows-container">
    <!-- Hero Section -->
    <section class="hero relative min-h-screen overflow-hidden bg-gray-900">
      <!-- Carousel -->
      <Carousel
        v-if="carouselShows.length > 0"
        ref="heroCarousel"
        :autoplay="5000"
        :wrap-around="true"
        class="h-screen"
        @slide-end="onSlideEnd"
      >
        <Slide v-for="(show, index) in carouselShows" :key="show.id ?? index">
          <div
            class="relative h-screen flex items-center justify-center bg-cover bg-center"
            :style="{ backgroundImage: `url(${show.backdrop})` }"
          >
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 to-black/40"></div>
            <div class="relative z-10 text-center px-4 md:px-12 max-w-3xl mx-auto">
              <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
                {{ show.title }}
              </h1>
              <p class="text-lg md:text-xl text-gray-200 mb-8 line-clamp-3">
                {{ show.overview }}
              </p>
              <button class="bg-red-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition">
                Watch Now
              </button>
            </div>
          </div>
        </Slide>
      </Carousel>

      <!-- Fallback if no shows -->
      <div v-else-if="!loading" class="text-white text-center mt-20">
        No TV shows found 😢
      </div>

      <!-- Loading state -->
      <div v-else class="text-white text-center mt-20">
        Loading TV shows...
      </div>
    </section>
  </div>
</template>

<script>
import { Carousel, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

export default {
  name: "TvShows",
  components: { Carousel, Slide },
  data() {
    return {
      carouselShows: [],
      loading: true,
      currentSlide: 0,
    };
  },
  mounted() {
    this.buildCarousel();
  },
  methods: {
    async fetchPopularTv() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        console.log("Popular TV:", data.results); // 👈 Debug
        return data.results;
      } catch (err) {
        console.error("Error fetching popular TV:", err);
        return [];
      }
    },
    async fetchOnAir() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/on_the_air?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        console.log("On Air TV:", data.results); // 👈 Debug
        return data.results;
      } catch (err) {
        console.error("Error fetching on-air TV:", err);
        return [];
      }
    },
    normalizeTv(t) {
      return {
        id: t.id,
        title: t.name || "Untitled",
        overview: t.overview || "No overview available",
        poster: t.poster_path
          ? `https://image.tmdb.org/t/p/w500${t.poster_path}`
          : "https://via.placeholder.com/500x750?text=No+Image",
        backdrop: t.backdrop_path
          ? `https://image.tmdb.org/t/p/original${t.backdrop_path}`
          : "https://via.placeholder.com/1280x720?text=No+Image",
      };
    },
    shuffleArray(array) {
      return array
        .map((item) => ({ item, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ item }) => item);
    },
    async buildCarousel() {
      const [popular, onAir] = await Promise.all([
        this.fetchPopularTv(),
        this.fetchOnAir(),
      ]);

      const normalizedPopular = (popular || []).map(this.normalizeTv);
      const normalizedOnAir = (onAir || []).map(this.normalizeTv);

      const combined = this.shuffleArray(
        normalizedPopular.concat(normalizedOnAir)
      );

      this.carouselShows = combined.slice(0, 10);
      console.log("Carousel Shows:", this.carouselShows); // 👈 Debug

      this.loading = false;
    },
    onSlideEnd({ currentSlide }) {
      this.currentSlide = currentSlide;
    },
  },
};
</script>

<style scoped>
.hero {
  position: relative;
}
</style>
