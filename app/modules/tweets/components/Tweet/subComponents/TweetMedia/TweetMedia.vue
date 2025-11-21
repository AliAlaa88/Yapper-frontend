<template>
    <!-- Single Image (no need for Swiper) -->
    <div 
        v-if="images && images.length === 1 && (!videos || videos.length === 0)" 
        class="rounded-2xl overflow-hidden border border-primary max-h-[500px]"
    >
        <img
            :src="images[0]"
            alt="Tweet image"
            class="w-full h-full object-cover cursor-pointer"
            @click="openLightbox(0)"
        />
    </div>

    <!-- Multiple Images (use Swiper) -->
    <Swiper
        v-else-if="images && images.length > 1"
        :modules="[Pagination]"
        :pagination="{ clickable: true }"
        class="rounded-2xl border border-primary tweet-media-swiper max-h-[500px]"
    >
        <SwiperSlide
            v-for="(image, index) in images"
            :key="index"
        >
            <img
                :src="image"
                :alt="`Tweet image ${index + 1}`"
                class="w-full h-full object-cover cursor-pointer"
                @click="openLightbox(index)"
            />
        </SwiperSlide>
    </Swiper>

    <!-- Videos -->
    <div
        v-if="videos && videos.length > 0"
        class="rounded-2xl overflow-hidden border border-primary"
        :class="{ 'mt-2': images && images.length > 0 }"
    >
        <VideoPlayer
            v-for="(video, index) in videos"
            :key="index"
            :src="video"
            :controls="true"
            :playback-rates="[0.5, 0.75, 1, 1.25, 1.5, 2]"
            :fluid="true"
            class="mb-2 last:mb-0 video-js vjs-big-play-centered"
        />
    </div>

    <!-- Lightbox -->
    <VueEasyLightbox
        v-if="images && images.length > 0"
        :visible="lightboxVisible"
        :imgs="images"
        :index="lightboxIndex"
        @hide="lightboxVisible = false"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VueEasyLightbox from 'vue-easy-lightbox'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import { VideoPlayer } from '@videojs-player/vue'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'

// Import video.js styles
import 'video.js/dist/video-js.css'

const props = defineProps<{
    images?: string[]
    videos?: string[]
}>()

// Lightbox state
const lightboxVisible = ref(false)
const lightboxIndex = ref(0)

function openLightbox(index: number) {
    lightboxIndex.value = index
    lightboxVisible.value = true
}
</script>

<style scoped>
.tweet-media-swiper {
    --swiper-pagination-color: #1d9bf0;
    --swiper-pagination-bullet-inactive-color: #fff;
    --swiper-pagination-bullet-inactive-opacity: 0.5;
    position: relative;
    z-index: 1;
}

.tweet-media-swiper :deep(.swiper-pagination) {
    bottom: 12px;
    z-index: 10;
}

.tweet-media-swiper :deep(.swiper-pagination-bullet) {
    width: 8px;
    height: 8px;
    background-color: var(--swiper-pagination-bullet-inactive-color);
    opacity: var(--swiper-pagination-bullet-inactive-opacity);
}

.tweet-media-swiper :deep(.swiper-pagination-bullet-active) {
    opacity: 1;
    background-color: var(--swiper-pagination-color);
}

/* Video player styling */
:deep(.video-js) {
    max-height: 500px;
    position: relative;
    z-index: 1;
}

:deep(.video-js .vjs-control-bar) {
    z-index: 2;
}

:deep(.video-js .vjs-big-play-button) {
    z-index: 2;
}
</style>
