<template>
    <!-- Mobile: Bottom sheet overlay -->
    <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 z-50"
        @click="$emit('close')"
    ></div>
    <div
        v-if="isOpen"
        ref="gifPickerRef"
        class="fixed z-60 bg-primary border border-primary shadow-lg overflow-hidden
               md:rounded-lg rounded-t-2xl rounded-b-none
               inset-x-0 bottom-0 md:bottom-auto md:inset-x-auto
               w-full md:w-72 h-[60vh] md:h-80"
        :style="pickerStyle"
        @click.stop
    >
        <div class="p-2 border-b border-primary flex gap-2" id="gif-picker-container">
            <input
                v-model="query"
                type="text"
                placeholder="Search GIFs..."
                id="gif-picker-search-input"
                @input="searchGifs"
                class="w-full px-2 py-1 rounded bg-primary outline-none text-sm text-primary placeholder:text-muted"
            />
            <button
                @click="$emit('close')"
                class="text-muted hover:text-primary"
                id="close-gif-picker-btn"
            >
                <X class="w-4 h-4" />
            </button>
        </div>

        <div class="overflow-y-auto h-[calc(100%-40px)] grid grid-cols-3 gap-1 p-1">
            <div
                v-for="gif in gifs"
                :key="gif.id"
                class="cursor-pointer hover:opacity-80"
                @click="selectGif(gif)"
            >
                <img
                    :src="gif.images.fixed_height_small.url"
                    :alt="gif.title"
                    class="rounded-md w-full h-full object-cover"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, nextTick, computed, onMounted } from 'vue'
import { X } from 'lucide-vue-next'

interface Gif {
    id: string
    title: string
    images: {
        fixed_height_small: {
            url: string
        }
        original: {
            url: string
        }
    }
}

interface Props {
    isOpen: boolean
    position?: 'top' | 'bottom'
}

const props = withDefaults(defineProps<Props>(), {
    position: 'bottom',
})
const emit = defineEmits(['select', 'close'])

const config = useRuntimeConfig()
const gifs = ref<Gif[]>([])
const query = ref('')
const gifPickerRef = ref<HTMLElement | null>(null)
const triggerRect = ref<DOMRect | null>(null)

// Compute style for fixed positioning on desktop
const pickerStyle = computed(() => {
    // On mobile, use bottom sheet positioning
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
        return {}
    }
    
    if (!triggerRect.value) {
        return {}
    }
    
    const rect = triggerRect.value
    const pickerHeight = 320 // md:h-80 = 320px
    const pickerWidth = 288 // md:w-72 = 288px
    
    if (props.position === 'top') {
        return {
            left: `${rect.left}px`,
            bottom: `${window.innerHeight - rect.top + 8}px`,
            width: `${pickerWidth}px`,
        }
    } else {
        return {
            left: `${rect.left}px`,
            top: `${rect.bottom + 8}px`,
            width: `${pickerWidth}px`,
        }
    }
})

// Your Giphy API Key
const API_KEY = config.public.gifApiKey

// Fetch Trending GIFs
const fetchTrending = async () => {
    const res = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=30`)
    const data = await res.json()
    gifs.value = data.data
}

// Search GIFs
let searchTimeout: NodeJS.Timeout | null = null
const searchGifs = () => {
    if (searchTimeout) {
        clearTimeout(searchTimeout)
    }
    searchTimeout = setTimeout(async () => {
        if (!query.value.trim()) return fetchTrending()

        const res = await fetch(
            `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(query.value)}&limit=30`,
        )
        const data = await res.json()
        gifs.value = data.data
    }, 500)
}

const selectGif = (gif: Gif) => {
    emit('select', gif.images.original.url)
    emit('close')
}

const handleClickOutside = (event: MouseEvent) => {
    if (gifPickerRef.value && !gifPickerRef.value.contains(event.target as Node)) {
        emit('close')
    }
}

watch(
    () => props.isOpen,
    async (newValue) => {
        if (newValue && gifs.value.length === 0) {
            fetchTrending()
        }
        if (newValue) {
            await nextTick()
            // Get the trigger button's position (parent element's first button)
            if (gifPickerRef.value) {
                const parent = gifPickerRef.value.parentElement
                const triggerButton = parent?.querySelector('button')
                if (triggerButton) {
                    triggerRect.value = triggerButton.getBoundingClientRect()
                }
            }
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside, true)
            }, 0)
        } else {
            document.removeEventListener('click', handleClickOutside, true)
            triggerRect.value = null
        }
    },
)

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside, true)
})
</script>
