<template>
    <div
        v-if="isOpen"
        class="absolute z-50 mt-2 w-72 h-80 bg-primary border border-primary rounded-lg shadow-lg overflow-hidden"
    >
        <div class="p-2 border-b border-primary flex gap-2">
            <input
                v-model="query"
                type="text"
                placeholder="Search GIFs..."
                @input="searchGifs"
                class="w-full px-2 py-1 rounded bg-primary outline-none text-sm text-primary placeholder:text-muted"
            />
            <button @click="$emit('close')" class="text-muted hover:text-primary">
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
import { ref, watch } from 'vue'
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
}

const props = defineProps<Props>()
const emit = defineEmits(['select', 'close'])

const config = useRuntimeConfig()
const gifs = ref<Gif[]>([])
const query = ref('')

// Your Giphy API Key
const API_KEY = config.public.giphyApiKey

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

watch(
    () => props.isOpen,
    (newValue) => {
        if (newValue && gifs.value.length === 0) {
            fetchTrending()
        }
    },
)
</script>
