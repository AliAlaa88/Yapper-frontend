import { ref, computed, watch, onMounted } from 'vue'
import { useWindowSize } from '@vueuse/core'

const SIDEBAR_STORAGE_KEY = 'sidebar-expanded-state'
const AUTO_COLLAPSE_BREAKPOINT = 1100
const EXPANDED_WIDTH = 275
const COLLAPSED_WIDTH = 70

const isExpanded = ref<boolean | null>(null)
const { width: windowWidth } = useWindowSize()

const initializeSidebarState = () => {
    if (import.meta.client) {
        const savedState = localStorage.getItem(SIDEBAR_STORAGE_KEY)

        if (savedState !== null) {
            isExpanded.value = savedState === 'true'
        } else {
            isExpanded.value = windowWidth.value >= AUTO_COLLAPSE_BREAKPOINT
        }
    } else {
        isExpanded.value = false
    }
}

watch(windowWidth, (newWidth) => {
    if (import.meta.client) {
        const savedState = localStorage.getItem(SIDEBAR_STORAGE_KEY)

        if (savedState === null) {
            isExpanded.value = newWidth >= AUTO_COLLAPSE_BREAKPOINT
        }
    }
})

const savePreference = (expanded: boolean) => {
    if (import.meta.client) {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, expanded.toString())
    }
}

export const useSidebarState = () => {
    onMounted(() => {
        if (isExpanded.value === null) {
            initializeSidebarState()
        }
    })

    if (import.meta.client && isExpanded.value === null) {
        initializeSidebarState()
    }

    const isCollapsed = computed(() => !isExpanded.value)

    const sidebarWidth = computed(() => {
        return isExpanded.value ? EXPANDED_WIDTH : COLLAPSED_WIDTH
    })

    const toggleSidebar = () => {
        isExpanded.value = !isExpanded.value
        savePreference(isExpanded.value)
    }

    const expandSidebar = () => {
        isExpanded.value = true
        savePreference(true)
    }

    const collapseSidebar = () => {
        isExpanded.value = false
        savePreference(false)
    }

    return {
        isCollapsed,
        isExpanded: computed(() => isExpanded.value ?? false),
        sidebarWidth,
        toggleSidebar,
        expandSidebar,
        collapseSidebar,
    }
}
