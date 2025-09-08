<template>
  <div class="tv-container">
    <!-- Hero Section -->
    <section class="hero relative min-h-screen overflow-hidden mb-8">
      <Carousel
        ref="heroCarousel"
        :autoplay="5000"
        :wrap-around="true"
        :items-to-show="1"
        :items-to-scroll="1"
        :snap-align="start"
        :transition="1000"
        :gap="0"
        class="h-screen"
        @slide-end="onSlideEnd"
      >
        <Slide v-for="(show, index) in carouselShows" :key="show.uid ?? index">
          <div class="relative w-full h-screen flex items-center justify-center">
            <!-- Background/backdrop -->
            <img
              :src="show.backdrop_path ? `https://image.tmdb.org/t/p/original${show.backdrop_path}` : fallbackImage"
              :alt="show.title"
              class="absolute inset-0 w-full h-full object-cover scale-105"
            />
            <div class="absolute inset-0 bg-black/60"></div>

            <!-- Content (text + poster) -->
            <div class="absolute inset-0 flex items-end md:items-center justify-between px-6 md:px-12 lg:px-16 z-10">
              <!-- Left: Text -->
              <div class="max-w-xl text-left pb-6 md:pb-0">
                <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-white">
                  {{ show.title }}
                </h1>

                <p class="text-sm sm:text-base md:text-lg text-gray-200 mb-5 line-clamp-3">
                  {{ show.overview || 'No description available.' }}
                </p>

                <div class="flex items-center gap-4">
                  <button
                    @click="openTrailer(show.original_id, 'tv')"
                    class="flex items-center gap-3 px-6 py-3 rounded-full bg-red-600 hover:bg-red-700"
                  >
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M5 3v18l15-9L5 3z" fill="#fff"></path>
                    </svg>
                    <span class="font-medium">Watch Trailer</span>
                  </button>

                  <button
                    @click="openInfo(show)"
                    class="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20"
                  >
                    More info
                  </button>
                </div>
              </div>

              <!-- Right: Poster -->
              <div class="hidden md:block relative w-72 lg:w-96 h-full pointer-events-auto">
                <div
                  class="poster-wrapper absolute right-0 bottom-0 transform translate-y-6 lg:translate-y-12"
                  style="will-change: transform;"
                >
                  <img
                    :src="show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : fallbackImage"
                    :alt="show.title"
                    class="rounded-2xl shadow-2xl w-72 lg:w-96 object-cover transform scale-105 transition duration-500 hover:scale-110"
                  />
                </div>
              </div>
            </div>

            <!-- Left gradient only -->
            <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none"></div>
          </div>
        </Slide>
      </Carousel>

      <!-- Prev/Next buttons -->
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

    <!-- Trailer Modal -->
    <TrailerModal
      v-if="showTrailer"
      ref="trailerModal"
      :movieId="selectedShow?.original_id"
      :mediaType="selectedShow?.content_type || 'tv'"
      :isOpen="showTrailer"
      @close="closeTrailer"
    />

    <!-- Info Modal -->
    <InfoModal
      v-if="showInfo"
      :movieId="selectedShow?.original_id"
      :type="selectedShow?.content_type || 'tv'"
      :isOpen="showInfo"
      @close="closeInfo"
      @playTrailer="playTrailerFromInfo"
    />
  </div>
</template>

<script>
import { Carousel, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import axios from "axios";
import TrailerModal from "../components/TrailerModal.vue";
import InfoModal from "../components/InfoModal.vue";

export default {
  name: "TvShows",
  components: { Carousel, Slide, TrailerModal, InfoModal },

  data() {
    return {
      carouselShows: [],
      selectedShow: null,
      showTrailer: false,
      showInfo: false,
      loading: true,
      fallbackImage: "https://via.placeholder.com/200x300?text=No+Image",
      apiKey: import.meta.env.VITE_TMDB_API_KEY,
      baseUrl: "https://api.themoviedb.org/3",
      currentSlide: 0,
    };
  },

  methods: {
    async fetchPopularTv() {
      try {
        const res = await axios.get(`${this.baseUrl}/tv/popular`, {
          params: { api_key: this.apiKey, language: "en-US", page: 1 },
        });
        return res.data.results || [];
      } catch (err) {
        console.error("Error fetching popular TV shows:", err);
        return [];
      }
    },

    async fetchOnAir() {
      try {
        const res = await axios.get(`${this.baseUrl}/tv/on_the_air`, {
          params: { api_key: this.apiKey, language: "en-US", page: 1 },
        });
        return res.data.results || [];
      } catch (err) {
        console.error("Error fetching on the air TV shows:", err);
        return [];
      }
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
      const [popular, onAir] = await Promise.all([this.fetchPopularTv(), this.fetchOnAir()]);
      const normalizedPopular = (popular || []).map(this.normalizeTv);
      const normalizedOnAir = (onAir || []).map(this.normalizeTv);

      const combined = this.shuffleArray(normalizedPopular.concat(normalizedOnAir));
      this.carouselShows = combined.slice(0, 10);

      this.loading = false;
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

    openTrailer(id, type = "tv") {
      this.selectedShow = { original_id: id, content_type: type };
      this.showTrailer = true;
    },

    openInfo(show) {
      this.selectedShow = show;
      this.showInfo = true;
    },

    playTrailerFromInfo(movieId, mediaType = "tv") {
      this.selectedShow = { original_id: movieId, content_type: mediaType };
      this.showInfo = false;
      this.$nextTick(() => {
        this.showTrailer = true;
      });
    },

    closeTrailer() {
      this.showTrailer = false;
      this.selectedShow = null;
    },

    closeInfo() {
      this.showInfo = false;
    },
  },

  async created() {
    await this.buildCarousel();
  },

  watch: {
    showInfo(val) {
      document.body.style.overflow = val || this.showTrailer ? "hidden" : "";
    },
    showTrailer(val) {
      document.body.style.overflow = val || this.showInfo ? "hidden" : "";
    },
  },
};
</script>

<style>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* make poster pop out */
.poster-wrapper img {
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6), 0 6px 18px rgba(0,0,0,0.4);
}

/* keep layout consistent */
.hero {
  position: relative;
}
</style>
