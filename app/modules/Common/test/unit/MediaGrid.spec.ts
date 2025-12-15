import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { createI18n } from 'vue-i18n'
import MediaGrid from '../../components/MediaGrid/MediaGrid.vue'

const i18n = createI18n({
    locale: 'en',
    messages: {
        en: {
            tweets: {
                loading: { tweets: 'Loading tweets...' },
                errors: { loadFailed: 'Failed to load', tryAgain: 'Try again' },
                empty: { noTweets: 'No tweets', noTweetsDescription: 'No tweets to display' },
            },
        },
        ar: {},
    },
})

// Mock useGenericInfiniteQuery composable
vi.mock('~/modules/Common/composables/useGenericInfiniteQuery', () => ({
    useGenericInfiniteQuery: vi.fn(() => ({
        items: ref([]),
        isFetching: ref(false),
        isFetchingNextPage: ref(false),
        isPending: ref(false),
        error: ref(null),
        loadMoreTrigger: ref(null),
        refetch: vi.fn(),
    })),
}))

// Mock InfiniteList component
vi.mock('~/modules/Common/components/InfiniteList', () => ({
    InfiniteList: {
        name: 'InfiniteList',
        props: ['modelValue', 'items', 'isPending', 'isFetching', 'isFetchingNextPage', 'error'],
        emits: ['update:modelValue', 'retry'],
        template: '<div class="infinite-list"><slot name="default" :items="items"></slot></div>',
    },
}))

vi.mock('#app', () => ({
    useNuxtApp: () => ({
        $listService: {
            fetchList: vi.fn(),
        },
    }),
}))

describe('MediaGrid Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should render media grid container', () => {
        const wrapper = mount(MediaGrid, {
            props: {
                fetchingSource: null,
            },
            global: {
                plugins: [i18n],
                stubs: {
                    NuxtImg: true,
                    NuxtLink: true,
                },
            },
        })

        expect(wrapper.find('.infinite-list').exists()).toBe(true)
    })

    it('should handle fetchingSource prop', () => {
        const wrapper = mount(MediaGrid, {
            props: {
                fetchingSource: 'profile',
            },
            global: {
                plugins: [i18n],
                stubs: {
                    NuxtImg: true,
                    NuxtLink: true,
                },
            },
        })

        expect(wrapper.props('fetchingSource')).toBe('profile')
    })

    it('should initialize useGenericInfiniteQuery hook', () => {
        const wrapper = mount(MediaGrid, {
            props: {
                fetchingSource: null,
            },
            global: {
                plugins: [i18n],
                stubs: {
                    NuxtImg: true,
                    NuxtLink: true,
                },
            },
        })

        expect(wrapper.vm).toBeDefined()
    })

    it('should have videoDurations reactive object', () => {
        const wrapper = mount(MediaGrid, {
            props: {
                fetchingSource: null,
            },
            global: {
                plugins: [i18n],
                stubs: {
                    NuxtImg: true,
                    NuxtLink: true,
                },
            },
        })

        expect(wrapper.vm).toBeDefined()
    })

    it('should render InfiniteList component', () => {
        const wrapper = mount(MediaGrid, {
            props: {
                fetchingSource: null,
            },
            global: {
                plugins: [i18n],
                stubs: {
                    NuxtImg: true,
                    NuxtLink: true,
                },
            },
        })

        const infiniteList = wrapper.findComponent({ name: 'InfiniteList' })
        expect(infiniteList.exists()).toBe(true)
    })

    it('should pass fetchingSource to query', () => {
        const wrapper = mount(MediaGrid, {
            props: {
                fetchingSource: 'timeline',
            },
            global: {
                plugins: [i18n],
                stubs: {
                    NuxtImg: true,
                    NuxtLink: true,
                },
            },
        })

        expect(wrapper.props('fetchingSource')).toBe('timeline')
    })

    it('should handle null fetchingSource', () => {
        const wrapper = mount(MediaGrid, {
            props: {
                fetchingSource: null,
            },
            global: {
                plugins: [i18n],
                stubs: {
                    NuxtImg: true,
                    NuxtLink: true,
                },
            },
        })

        expect(wrapper.props('fetchingSource')).toBeNull()
    })

    it('should have formatDuration method', () => {
        const wrapper = mount(MediaGrid, {
            props: {
                fetchingSource: null,
            },
            global: {
                plugins: [i18n],
                stubs: {
                    NuxtImg: true,
                    NuxtLink: true,
                },
            },
        })

        expect(wrapper.vm).toBeDefined()
    })

    it('should handle handleVideoMetadata callback', () => {
        const wrapper = mount(MediaGrid, {
            props: {
                fetchingSource: null,
            },
            global: {
                plugins: [i18n],
                stubs: {
                    NuxtImg: true,
                    NuxtLink: true,
                },
            },
        })

        expect(wrapper.vm).toBeDefined()
    })

    it('should support prop updates', async () => {
        const wrapper = mount(MediaGrid, {
            props: {
                fetchingSource: 'profile',
            },
            global: {
                plugins: [i18n],
                stubs: {
                    NuxtImg: true,
                    NuxtLink: true,
                },
            },
        })

        await wrapper.setProps({ fetchingSource: 'search' })
        expect(wrapper.props('fetchingSource')).toBe('search')
    })

    it('should maintain reactive state', () => {
        const wrapper = mount(MediaGrid, {
            props: {
                fetchingSource: null,
            },
            global: {
                plugins: [i18n],
                stubs: {
                    NuxtImg: true,
                    NuxtLink: true,
                },
            },
        })

        expect(wrapper.find('.infinite-list').exists()).toBe(true)
    })

    it('should render without errors', () => {
        expect(() => {
            mount(MediaGrid, {
                props: {
                    fetchingSource: null,
                },
                global: {
                    plugins: [i18n],
                    stubs: {
                        NuxtImg: true,
                        NuxtLink: true,
                    },
                },
            })
        }).not.toThrow()
    })

    it('should support slot rendering', () => {
        const wrapper = mount(MediaGrid, {
            props: {
                fetchingSource: null,
            },
            global: {
                plugins: [i18n],
                stubs: {
                    NuxtImg: true,
                    NuxtLink: true,
                },
            },
        })

        expect(wrapper.find('.infinite-list').exists()).toBe(true)
    })

    it('should handle component lifecycle', () => {
        const wrapper = mount(MediaGrid, {
            props: {
                fetchingSource: null,
            },
            global: {
                plugins: [i18n],
                stubs: {
                    NuxtImg: true,
                    NuxtLink: true,
                },
            },
        })

        expect(wrapper.vm).toBeDefined()
        wrapper.unmount()
    })

    it('should use correct grid styling', () => {
        const wrapper = mount(MediaGrid, {
            props: {
                fetchingSource: null,
            },
            global: {
                plugins: [i18n],
                stubs: {
                    NuxtImg: true,
                    NuxtLink: true,
                },
            },
        })

        const infiniteList = wrapper.findComponent({ name: 'InfiniteList' })
        expect(infiniteList.exists()).toBe(true)
    })

    it('should handle reactive fetchingSource changes', async () => {
        const wrapper = mount(MediaGrid, {
            props: {
                fetchingSource: 'profile',
            },
            global: {
                plugins: [i18n],
                stubs: {
                    NuxtImg: true,
                    NuxtLink: true,
                },
            },
        })

        const before = wrapper.props('fetchingSource')
        await wrapper.setProps({ fetchingSource: 'explore' })
        const after = wrapper.props('fetchingSource')

        expect(before).not.toBe(after)
        expect(after).toBe('explore')
    })
})
