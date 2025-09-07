<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    @click.self="closeModal"
  >
    <div class="bg-black rounded-xl shadow-lg w-11/12 md:w-3/4 lg:w-2/3 relative">
      <!-- Close Button -->
      <button
        @click="closeModal"
        class="absolute top-3 right-3 text-white bg-red-600 rounded-full px-3 py-1 hover:bg-red-700"
      >
        ✕
      </button>

      <!-- Trailer -->
      <div v-if="loading" class="p-6 text-center text-white">Loading trailer...</div>
      <div v-else-if="trailerKey" class="aspect-video">
        <iframe
          :src="`https://www.youtube.com/embed/${trailerKey}?autoplay=1`"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen
          class="w-full h-full rounded-xl"
        ></iframe>
      </div>
      <div v-else class="p-6 text-center text-white">
        No trailer available.
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TrailerModal",
  props: {
    movieId: {
      type: Number,
      required: true,
    },
    mediaType: {
      type: String,
      required: true, // "movie" or "tv"
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      trailerKey: null,
      loading: false,
    };
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.fetchTrailer();
      }
    },
  },
  methods: {
    async fetchTrailer() {
      this.trailerKey = null;
      this.loading = true;
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const url = `https://api.themoviedb.org/3/${this.mediaType}/${this.movieId}/videos?api_key=${apiKey}&language=en-US`;
        const res = await axios.get(url);

        const videos = res.data.results || [];
        const trailer = videos.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );

        this.trailerKey = trailer ? trailer.key : null;
      } catch (err) {
        console.error("Error fetching trailer:", err);
      } finally {
        this.loading = false;
      }
    },
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.aspect-video {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 ratio */
  height: 0;
}
.aspect-video iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
