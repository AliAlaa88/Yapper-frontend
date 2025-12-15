<template>
    <Swiper
        ref="swiperRef"
        :modules="[Pagination]"
        :pagination="{ clickable: true }"
        class="rounded-2xl border border-primary tweet-media-swiper max-h-[500px]"
        @slideChange="onSlideChange"
    >
        <SwiperSlide
            v-for="(media, index) in mediaArray"
            :key="index"
            :class="media.type === 'video' ? 'video-slide' : ''"
        >
            <LazyNuxtImg
                v-if="media.type === 'image'"
                :src="media.url"
                :alt="`Tweet image ${index + 1}`"
                class="w-full h-full object-cover cursor-pointer"
                @click="openLightbox(index)"
            />

            <div
                v-else-if="media.type === 'video'"
                class="video-wrapper w-full h-full"
                :data-slide-index="index"
                @pointerdown.stop.prevent="onVideoPointerDown"
                @pointerup.stop.prevent="onVideoPointerUp"
                @pointercancel.stop.prevent="onVideoPointerUp"
                @touchstart.stop.prevent="onVideoPointerDown"
                @touchend.stop.prevent="onVideoPointerUp"
                @mousedown.stop.prevent="onVideoPointerDown"
                @mouseup.stop.prevent="onVideoPointerUp"
            >
                <VideoPlayer
                    :src="media.url"
                    :controls="true"
                    :playback-rates="[0.5, 0.75, 1, 1.25, 1.5, 2]"
                    :fluid="true"
                    class="mb-2 last:mb-0 video-js vjs-big-play-centered"
                />
            </div>
        </SwiperSlide>
    </Swiper>

    <VueEasyLightbox
        v-if="images && images.length > 0"
        :visible="lightboxVisible"
        :imgs="images"
        :index="lightboxIndex"
        @hide="lightboxVisible = false"
    />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import VueEasyLightbox from 'vue-easy-lightbox'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import { VideoPlayer } from '@videojs-player/vue'

import 'swiper/css'
import 'swiper/css/pagination'

import 'video.js/dist/video-js.css'

const props = defineProps<{
    images?: string[]
    videos?: string[]
}>()

const lightboxVisible = ref(false)
const lightboxIndex = ref(0)
const mediaArray = computed(() => {
    return [
        ...(props.images || []).map((image) => ({ type: 'image', url: image })),
        ...(props.videos || []).map((video) => ({ type: 'video', url: video })),
    ]
})

const videoPlayersRef = ref<InstanceType<typeof VideoPlayer>[]>([])

const swiperRef = ref<any>(null)

let intersectionObserver: IntersectionObserver | null = null

function getSwiperInstance() {
    return swiperRef.value?.swiper ?? swiperRef.value
}

function setSwiperAllowTouch(allow: boolean) {
    const s = getSwiperInstance()
    if (!s) return
    try {
        s.allowTouchMove = allow
    } catch {}
}

function onVideoPointerDown(e: Event) {
    e.stopPropagation()
    setSwiperAllowTouch(false)
}

function onVideoPointerUp(e: Event) {
    e.stopPropagation()
    setSwiperAllowTouch(true)
}

function openLightbox(index: number) {
    lightboxIndex.value = index
    lightboxVisible.value = true
}

function pauseAllVideos() {
    const videoWrappers = document.querySelectorAll('.video-wrapper')
    videoWrappers.forEach((wrapper) => {
        const videoPlayer = wrapper.querySelector('.video-js') as any
        if (videoPlayer && videoPlayer.player && typeof videoPlayer.player.pause === 'function') {
            videoPlayer.player.pause()
        }
    })
}

function pauseVideo(wrapper: HTMLElement) {
    const videoPlayer = wrapper.querySelector('.video-js') as any
    if (videoPlayer && videoPlayer.player && typeof videoPlayer.player.pause === 'function') {
        videoPlayer.player.pause()
    }
}

function onSlideChange(swiper: any) {
    const activeIndex = swiper.activeIndex
    const videoWrappers = swiper.el.querySelectorAll('.video-wrapper')

    videoWrappers.forEach((wrapper: HTMLElement) => {
        const slideIndex = parseInt(wrapper.getAttribute('data-slide-index') || '0', 10)
        if (slideIndex !== activeIndex) {
            pauseVideo(wrapper)
        }
    })
}

function setupVideoObserver() {
    if (intersectionObserver) {
        intersectionObserver.disconnect()
    }

    intersectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const videoWrapper = entry.target as HTMLElement

                if (!entry.isIntersecting) {
                    pauseVideo(videoWrapper)
                }
                // You can auto-play when video comes into view
                // else if (entry.isIntersecting) {
                //     const videoPlayer = videoWrapper.querySelector('.video-js') as any
                //     if (videoPlayer && videoPlayer.player) {
                //         videoPlayer.player.play()
                //     }
                // }
            })
        },
        {
            threshold: 0.5,

            rootMargin: '0px',
        },
    )

    setTimeout(() => {
        if (swiperRef.value) {
            const swiper = getSwiperInstance()
            const container = swiper?.el || swiperRef.value.$el

            if (container) {
                const videoWrappers = container.querySelectorAll('.video-wrapper')
                videoWrappers.forEach((wrapper: Element) => {
                    intersectionObserver?.observe(wrapper)
                })
            }
        }
    }, 100)
}

// Pause videos when tab loses focus
const handleVisibilityChange = () => {
    if (document.hidden) {
        pauseAllVideos()
    }
}

onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Setup Intersection Observer
    setupVideoObserver()

    // Capture-phase handlers to prevent Swiper from intercepting video interactions
    const onDocPointerDown = (e: Event) => {
        const target = e.target as HTMLElement | null
        if (!target) return
        if (target.closest && target.closest('.video-wrapper')) {
            // Disable swiper touch moves while interacting with video
            setSwiperAllowTouch(false)
            // Stop propagation so Swiper doesn't receive the event
            e.stopPropagation()
        }
    }

    const onDocPointerMove = (e: Event) => {
        const target = e.target as HTMLElement | null
        if (!target) return
        if (target.closest && target.closest('.video-wrapper')) {
            // Prevent Swiper from acting on move events inside video
            e.stopPropagation()
        }
    }

    const onDocPointerUp = (e: Event) => {
        const target = e.target as HTMLElement | null
        if (!target) return
        if (target.closest && target.closest('.video-wrapper')) {
            // Re-enable swiper touch moves after interaction
            setSwiperAllowTouch(true)
            e.stopPropagation()
        }
    }

    // Attach capture listeners
    document.addEventListener('pointerdown', onDocPointerDown, true)
    document.addEventListener('pointermove', onDocPointerMove, true)
    document.addEventListener('pointerup', onDocPointerUp, true)
    document.addEventListener('touchstart', onDocPointerDown, true)
    document.addEventListener('touchmove', onDocPointerMove, true)
    document.addEventListener('touchend', onDocPointerUp, true)

    // store handlers for removal
    ;(onMounted as any)._tweetMedia_docHandlers = {
        onDocPointerDown,
        onDocPointerMove,
        onDocPointerUp,
    }
})

onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup Intersection Observer
    if (intersectionObserver) {
        intersectionObserver.disconnect()
        intersectionObserver = null
    }

    // Cleanup document event handlers
    const handlers = (onMounted as any)._tweetMedia_docHandlers
    if (handlers) {
        document.removeEventListener('pointerdown', handlers.onDocPointerDown, true)
        document.removeEventListener('pointermove', handlers.onDocPointerMove, true)
        document.removeEventListener('pointerup', handlers.onDocPointerUp, true)
        document.removeEventListener('touchstart', handlers.onDocPointerDown, true)
        document.removeEventListener('touchmove', handlers.onDocPointerMove, true)
        document.removeEventListener('touchend', handlers.onDocPointerUp, true)
        ;(onMounted as any)._tweetMedia_docHandlers = undefined
    }
})
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

/* Ensure pointer events for video slides and make video fill the container */
.video-slide,
.video-wrapper,
.video-wrapper :deep(video),
.video-wrapper :deep(.vjs-tech) {
    pointer-events: auto !important;
}

.video-wrapper :deep(video),
.video-wrapper :deep(.vjs-tech) {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
}

/* Make sure Swiper and slides take full height so video can fill */
/* Make slides center their content and avoid forcing 100% height (which can collapse) */
.tweet-media-swiper :deep(.swiper-slide) {
    display: flex;
    align-items: center;
    justify-content: center;
}

.tweet-media-swiper {
    /* defined max-height for the component */
    max-height: 500px;
}

/* Give the video wrapper an intrinsic aspect ratio so it always has height
   without relying on parent 100% heights. Keeps a 16:9 box with a max height. */
.video-wrapper {
    position: relative;
    width: 100%;
    padding-top: 56.25%; /* 16:9 aspect ratio */
    max-height: 500px;
}

/* Absolutely position the video player inside the aspect box */
.video-wrapper :deep(.video-js) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
}

/* Ensure video-js container fills the wrapper */
:deep(.video-js) {
    width: 100% !important;
    height: 100% !important;
    padding-top: 0 !important; /* disable fluid aspect ratio */
    display: block;
    overflow: hidden;
}

:deep(.video-js .vjs-tech) {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
}
</style>
