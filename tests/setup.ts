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
globalThis.useRouter = () => ({ push: vi.fn(), replace: vi.fn(), go: vi.fn(), back: vi.fn(), currentRoute: {} })
globalThis.useRoute = () => ({ params: {}, query: {}, path: '/', name: '', fullPath: '/', meta: {}, matched: [] })
globalThis.useI18n = () => ({ t: (key) => key, locale: 'en' })
globalThis.useRouter = () => ({ push: vi.fn(), replace: vi.fn(), go: vi.fn(), back: vi.fn() })
globalThis.useRoute = () => ({ params: {}, query: {}, path: '/', name: '', fullPath: '/', meta: {} })
globalThis.useI18n = () => ({ t: (key) => key, locale: 'en' })
globalThis.$t = (key) => key
import 'fake-indexeddb/auto';

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
vi.mock('#app', () => {
	const mock = {
		navigateTo: vi.fn(),
		$t: (key) => key,
		useRouter: () => ({ push: vi.fn(), replace: vi.fn(), go: vi.fn(), back: vi.fn(), currentRoute: {} }),
		useRoute: () => ({ params: {}, query: {}, path: '/', name: '', fullPath: '/', meta: {}, matched: [] }),
		useI18n: () => ({ t: (key) => key, locale: 'en' })
	}
	return { ...mock, default: mock }
})
vi.mock('vue-router', () => ({
	useRoute: () => ({ params: {}, query: {}, path: '/', name: '', fullPath: '/', meta: {} }),
	useRouter: () => ({ push: vi.fn(), replace: vi.fn(), go: vi.fn(), back: vi.fn() })
}))

// Vue reactivity utilities global mocks
import { ref, computed, reactive } from 'vue'
globalThis.ref = ref
globalThis.computed = computed
globalThis.reactive = reactive

// Vue reactivity utility: expose watch globally
import { watch } from 'vue'
globalThis.watch = watch

// Vue lifecycle utility: expose onUnmounted globally
import { onUnmounted } from 'vue'
globalThis.onUnmounted = onUnmounted

// Mock Vue Query plugin/context
vi.mock('@tanstack/vue-query', () => ({
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
}))


// Nuxt composables and i18n global mocks
vi.mock('#app', () => ({
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
	}),
	useRouter: () => ({ push: vi.fn(), replace: vi.fn(), go: vi.fn(), back: vi.fn() }),
	useRoute: () => ({ params: {}, query: {}, path: '/', name: '', fullPath: '/', meta: {} }),
	useI18n: () => ({ t: (key) => key, locale: 'en' }),
	$t: (key) => key,
	navigateTo: vi.fn()
}))

// vue-i18n global mock (for direct import)
vi.mock('vue-i18n', () => ({
	useI18n: () => ({ t: (key: string) => key, locale: 'en' }),
	navigateTo: vi.fn(),
	$t: (key) => key
}))

// Expose $t globally for template usage
globalThis.$t = (key: string) => key
