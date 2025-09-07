<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    @click.self="closeModal"
  >
    <!-- Modal Card -->
    <div
      class="relative w-11/12 md:w-4/5 lg:w-3/4 max-h-[90vh] overflow-y-auto rounded-2xl bg-black text-white shadow-2xl"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div class="relative h-72 md:h-96 w-full">
        <img
          :src="movieDetails.backdrop_path ? `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}` : fallbackImage"
          alt="Backdrop"
          class="w-full h-full object-cover rounded-t-2xl"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

        <!-- Close Button -->
        <button
          @click="closeModal"
          class="absolute top-4 right-4 bg-black/60 hover:bg-black/80 p-2 rounded-full"
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-4">
        <template v-if="loading">
          <div class="text-center text-white">Loading details...</div>
        </template>

        <template v-else-if="movieDetails && Object.keys(movieDetails).length">
          <h1 class="text-3xl font-bold">
            {{ movieDetails.title || movieDetails.name }}
          </h1>

          <p class="text-gray-300 italic" v-if="movieDetails.tagline">
            "{{ movieDetails.tagline }}"
          </p>

          <div class="flex flex-wrap gap-4 text-sm text-gray-400">
            <span v-if="movieDetails.release_date">📅 {{ movieDetails.release_date }}</span>
            <span v-if="movieDetails.runtime">⏳ {{ movieDetails.runtime }} min</span>
            <span v-if="movieDetails.first_air_date">📺 {{ movieDetails.first_air_date }}</span>
            <span v-if="movieDetails.genres && movieDetails.genres.length">
              🎭 {{ movieDetails.genres.map(g => g.name).join(', ') }}
            </span>
            <span v-if="movieDetails.vote_average">⭐ {{ (movieDetails.vote_average || 0).toFixed(1) }}/10</span>
          </div>

          <p class="text-gray-200 leading-relaxed mt-2">
            {{ movieDetails.overview }}
          </p>

          <!-- Cast -->
          <div v-if="movieDetails.credits && movieDetails.credits.cast && movieDetails.credits.cast.length" class="mt-6">
            <h2 class="text-xl font-semibold mb-2">Cast</h2>
            <div class="flex overflow-x-auto gap-4 scrollbar-hide">
              <div
                v-for="actor in movieDetails.credits.cast.slice(0, 10)"
                :key="actor.id"
                class="w-24 flex-shrink-0 text-center"
              >
                <img
                  :src="actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : fallbackImage"
                  alt="Actor"
                  class="w-24 h-32 object-cover rounded-lg mb-2"
                />
                <p class="text-xs text-gray-300 truncate">{{ actor.name }}</p>
              </div>
            </div>
          </div>

          <!-- Trailer -->
          <div v-if="trailerKey" class="mt-6">
            <h2 class="text-xl font-semibold mb-2">Trailer</h2>
            <iframe
              :src="`https://www.youtube.com/embed/${trailerKey}?autoplay=0`"
              class="w-full h-64 md:h-96 rounded-lg"
              frameborder="0"
              allow="autoplay; encrypted-media"
              allowfullscreen
            ></iframe>
          </div>

          <div v-else-if="!trailerKey && !loading" class="mt-6 text-gray-300">
            No trailer available.
          </div>
        </template>

        <template v-else>
          <div class="text-center text-gray-300">No details available.</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "InfoModal",
  props: {
    movieId: { type: [Number, String], required: true },
    type: { type: String, default: "movie" }, // "movie" or "tv"
    isOpen: { type: Boolean, default: false }
  },
  data() {
    return {
      movieDetails: {},
      trailerKey: null,
      loading: false,
      fallbackImage: "https://via.placeholder.com/300x450?text=No+Image",
      baseUrl: "https://api.themoviedb.org/3",
      apiKey: import.meta.env.VITE_TMDB_API_KEY,
    };
  },
  watch: {
    // Run immediately when component is created/mounted so fetch happens
    isOpen: {
      immediate: true,
      handler(newVal) {
        if (newVal && this.movieId) {
          this.fetchMovieDetails();
        } else if (!newVal) {
          // clear state when closed
          this.movieDetails = {};
          this.trailerKey = null;
          this.loading = false;
        }
      }
    },
    // If movieId changes while modal open, refetch
    movieId(newId) {
      if (this.isOpen && newId) {
        this.fetchMovieDetails();
      }
    }
  },
  mounted() {
    // ESC to close
    document.addEventListener("keydown", this.onKeydown);
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.onKeydown);
  },
  methods: {
    onKeydown(e) {
      if (e.key === "Escape" && this.isOpen) {
        this.closeModal();
      }
    },
    closeModal() {
      this.$emit("close");
      // optional: clear local state (parent will usually unmount component)
      this.movieDetails = {};
      this.trailerKey = null;
      this.loading = false;
    },
    async fetchMovieDetails() {
      if (!this.movieId) return;
      this.loading = true;
      this.movieDetails = {};
      this.trailerKey = null;

      try {
        const res = await axios.get(`${this.baseUrl}/${this.type}/${this.movieId}`, {
          params: {
            api_key: this.apiKey,
            language: "en-US",
            append_to_response: "videos,credits,images"
          }
        });

        this.movieDetails = res.data || {};

        // prefer official YouTube Trailer, else Teaser, else any YouTube video
        const videos = res.data.videos?.results || [];
        let trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube" && v.official === true);
        if (!trailer) trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube");
        if (!trailer) trailer = videos.find(v => v.type === "Teaser" && v.site === "YouTube");
        if (!trailer) trailer = videos.find(v => v.site === "YouTube");

        this.trailerKey = trailer ? trailer.key : null;
      } catch (err) {
        console.error("Error fetching details:", err);
        this.movieDetails = {};
        this.trailerKey = null;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
