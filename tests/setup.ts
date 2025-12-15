// Ensure Nuxt composables and i18n utilities are available globally
globalThis.useNuxtApp = () => ({
    $queryClient: {
        getQueryData: vi.fn(),
        setQueryData: vi.fn(),
        invalidateQueries: vi.fn(),
        removeQueries: vi.fn(),
        refetchQueries: vi.fn(),
        fetchQuery: vi.fn(),
        queryClient: {},
    },
    $userInfoService: {},
    $tweetService: {},
})
globalThis.navigateTo = vi.fn()
globalThis.$t = (key) => key
globalThis.useRouter = () => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    currentRoute: {},
})
globalThis.useRoute = () => ({
    params: {},
    query: {},
    path: '/',
    name: '',
    fullPath: '/',
    meta: {},
    matched: [],
})
globalThis.useI18n = () => ({ t: (key) => key, locale: 'en' })
globalThis.useRouter = () => ({ push: vi.fn(), replace: vi.fn(), go: vi.fn(), back: vi.fn() })
globalThis.useRoute = () => ({
    params: {},
    query: {},
    path: '/',
    name: '',
    fullPath: '/',
    meta: {},
})
globalThis.useI18n = () => ({ t: (key) => key, locale: 'en' })
globalThis.$t = (key) => key
import 'fake-indexeddb/auto'

// Pinia setup for all tests
import { createPinia, setActivePinia } from 'pinia'
import { config } from '@vue/test-utils'
setActivePinia(createPinia())

// Inject $t as a global property for all Vue components
config.global.properties = config.global.properties || {}
config.global.properties.$t = (key) => key

// Vue Router global mocks
import { vi } from 'vitest'
// Mock #app for dynamic imports
vi.mock('#app', async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        navigateTo: vi.fn(),
        $t: (key) => key,
        useRouter: () => ({
            push: vi.fn(),
            replace: vi.fn(),
            go: vi.fn(),
            back: vi.fn(),
            currentRoute: {},
        }),
        useRoute: () => ({
            params: {},
            query: {},
            path: '/',
            name: '',
            fullPath: '/',
            meta: {},
            matched: [],
        }),
        useI18n: () => ({ t: (key) => key, locale: 'en' }),
    }
})
vi.mock('vue-router', async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        useRoute: () => ({ params: {}, query: {}, path: '/', name: '', fullPath: '/', meta: {} }),
        useRouter: () => ({ push: vi.fn(), replace: vi.fn(), go: vi.fn(), back: vi.fn() }),
    }
})

// Vue reactivity utilities global mocks
import { ref, computed, reactive } from 'vue'
globalThis.ref = ref
globalThis.computed = computed
globalThis.reactive = reactive

// Vue reactivity utility: expose watch globally
import { watch } from 'vue'
globalThis.watch = watch

// Vue lifecycle utility: expose onUnmounted and onMounted globally
import { onUnmounted, onMounted } from 'vue'
globalThis.onUnmounted = onUnmounted
globalThis.onMounted = onMounted
globalThis.useRuntimeConfig = () => ({
    public: {
        apiUrl: 'http://localhost:3000',
        env: 'test',
    },
})

// Mock Vue Query plugin/context
vi.mock('@tanstack/vue-query', async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        useQueryClient: () => ({
            getQueryData: vi.fn(),
            setQueryData: vi.fn(),
            invalidateQueries: vi.fn(),
            removeQueries: vi.fn(),
            refetchQueries: vi.fn(),
            fetchQuery: vi.fn(),
            queryClient: {},
        }),
        useMutation: vi.fn(),
        useQuery: vi.fn(),
        useInfiniteQuery: vi.fn(),
    }
})

// Nuxt composables and i18n global mocks
vi.mock('#app', async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        useNuxtApp: () => ({
            $queryClient: {
                getQueryData: vi.fn(),
                setQueryData: vi.fn(),
                invalidateQueries: vi.fn(),
                removeQueries: vi.fn(),
                refetchQueries: vi.fn(),
                fetchQuery: vi.fn(),
                queryClient: {},
            },
            $userInfoService: {},
            $tweetService: {},
            runWithContext: (fn: any) => fn(),
        }),
        useRouter: () => ({ push: vi.fn(), replace: vi.fn(), go: vi.fn(), back: vi.fn() }),
        useRoute: () => ({ params: {}, query: {}, path: '/', name: '', fullPath: '/', meta: {} }),
        useI18n: () => ({ t: (key) => key, locale: 'en' }),
        $t: (key) => key,
        navigateTo: vi.fn(),
        useRuntimeConfig: () => ({
            public: {
                apiUrl: 'http://localhost:3000',
                env: 'test',
            },
        }),
    }
})

// vue-i18n global mock (for direct import)
vi.mock('vue-i18n', async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        useI18n: () => ({ t: (key: string) => key, locale: 'en' }),
        navigateTo: vi.fn(),
        $t: (key) => key,
    }
})

// Expose $t globally for template usage
globalThis.$t = (key: string) => key
