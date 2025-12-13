<template>
    <div
        class="relative w-full max-w-full border-b border-primary bg-primary/80 group backdrop-blur-md"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
    >
        <!-- Left Arrow -->
        <button
            id="btn-scroll-tabs-left"
            v-if="canScrollLeft && isHovering"
            @click="scrollLeft"
            class="absolute left-0 top-0 bottom-0 z-10 flex items-center justify-center w-10 bg-linear-to-r from-x-background via-x-background to-transparent cursor-pointer transition-opacity duration-200"
            aria-label="Scroll left"
        >
            <ChevronLeft class="w-5 h-5 text-primary" />
        </button>

        <!-- Tabs Container -->
        <div
            ref="tabsContainer"
            class="overflow-x-auto overflow-y-hidden scrollbar-hide"
            @scroll="updateScrollState"
        >
            <ul class="flex w-full">
                <li
                    v-for="tab in tabs"
                    :key="tab.value"
                    class="flex-1 text-center cursor-pointer transition-all duration-200 hover:bg-hover"
                    @click="handleChange(tab.value)"
                    :id="tab.test_id"
                >
                    <button
                        class="relative cursor-pointer w-full px-4 py-4 text-base font-medium transition-colors duration-200 whitespace-nowrap"
                        :class="activeTab === tab.value ? 'text-primary' : 'text-muted'"
                    >
                        {{ tab.label }}
                        <span
                            v-if="activeTab === tab.value"
                            class="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-accent rounded-full"
                        />
                    </button>
                </li>
            </ul>
        </div>

        <!-- Right Arrow -->
        <button
            id="btn-scroll-tabs-right"
            v-if="canScrollRight && isHovering"
            @click="scrollRight"
            class="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-center w-10 bg-linear-to-l from-x-background via-x-background to-transparent cursor-pointer transition-opacity duration-200"
            aria-label="Scroll right"
        >
            <ChevronRight class="w-5 h-5 text-primary" />
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface Tab {
    label: string
    value: string
    test_id?: string
}

interface Props {
    tabs: Tab[]
    activeTab: string
    onChange: (tab: string) => void
}

const { tabs, activeTab, onChange } = defineProps<Props>()

const tabsContainer = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const isHovering = ref(false)

const updateScrollState = () => {
    if (!tabsContainer.value) return

    const { scrollLeft, scrollWidth, clientWidth } = tabsContainer.value
    canScrollLeft.value = scrollLeft > 0
    canScrollRight.value = scrollLeft + clientWidth < scrollWidth - 1
}

const scrollLeft = () => {
    if (!tabsContainer.value) return
    tabsContainer.value.scrollBy({ left: -150, behavior: 'smooth' })
}

const scrollRight = () => {
    if (!tabsContainer.value) return
    tabsContainer.value.scrollBy({ left: 150, behavior: 'smooth' })
}

const handleChange = (tab: string) => {
    onChange(tab)
}

onMounted(() => {
    nextTick(() => {
        updateScrollState()
    })
    window.addEventListener('resize', updateScrollState)
})

onUnmounted(() => {
    window.removeEventListener('resize', updateScrollState)
})
</script>
