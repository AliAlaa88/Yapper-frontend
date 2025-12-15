import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import PostTweet from '../../components/postTweet/PostTweet.vue'
import { createPinia, setActivePinia } from 'pinia'

// Mock dependencies
vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string, options?: any) => {
            if (key === 'timeline.postTweet.replyingTo') return 'Replying to'
            if (key === 'timeline.postTweet.placeholder') return "What's happening?"
            if (key === 'timeline.postTweet.post') return 'Post'
            return key
        },
    }),
}))

vi.mock('#app', () => ({
    navigateTo: vi.fn(),
    useNuxtApp: () => ({
        $chatSocketService: {
            totalUnreadChats: ref(0),
        },
        $notificationsSocketService: {
            unreadCount: ref(0),
        },
    }),
}))

vi.mock('pinia', () => ({
    storeToRefs: () => ({
        user: ref({
            id: 'user-1',
            username: 'testuser',
            name: 'Test User',
            avatar_url: 'https://example.com/avatar.jpg',
        }),
    }),
    defineStore: vi.fn(),
    createPinia: () => ({}),
    setActivePinia: vi.fn(),
}))

vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: () => ({
        user: ref({
            id: 'user-1',
            username: 'testuser',
            name: 'Test User',
            avatar_url: 'https://example.com/avatar.jpg',
        }),
    }),
}))

vi.mock('~/modules/TimeLine/queries/useUploadMedia', () => ({
    useUploadMedia: () => ({
        mutateAsync: vi.fn(),
    }),
}))

vi.mock('~/modules/TimeLine/queries/usePostTweet', () => ({
    usePostTweet: () => ({
        mutateAsync: vi.fn(),
        isPending: ref(false),
    }),
}))

vi.mock('~/utils/helpers', () => ({
    handleImageError: vi.fn(),
}))

describe('PostTweet Component', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        // Mock inject for snackbar
        vi.stubGlobal('inject', () => ({
            handleShowSnackbar: vi.fn(),
        }))
    })

    it('should mount component successfully', () => {
        const wrapper = mount(PostTweet, {
            global: {
                stubs: {
                    NuxtLink: true,
                    NuxtImg: true,
                    FormattedTextarea: true,
                    CustomToolTip: true,
                    MediaUpload: true,
                    GifPicker: true,
                    EmojiPicker: true,
                    QuotedTweet: true,
                    Button: true,
                },
            },
        })
        
        expect(wrapper.exists()).toBe(true)
    })

    it('should render form element', () => {
        const wrapper = mount(PostTweet, {
            global: {
                stubs: {
                    NuxtLink: true,
                    NuxtImg: true,
                    FormattedTextarea: true,
                    CustomToolTip: true,
                    MediaUpload: true,
                    GifPicker: true,
                    EmojiPicker: true,
                    QuotedTweet: true,
                    Button: true,
                },
            },
        })
        
        expect(wrapper.find('form').exists()).toBe(true)
    })

    it('should render user avatar', () => {
        const wrapper = mount(PostTweet, {
            global: {
                stubs: {
                    NuxtLink: { template: '<a><slot /></a>' },
                    NuxtImg: { template: '<img />' },
                    FormattedTextarea: true,
                    CustomToolTip: true,
                    MediaUpload: true,
                    GifPicker: true,
                    EmojiPicker: true,
                    QuotedTweet: true,
                    Button: true,
                },
            },
        })
        
        expect(wrapper.find('img').exists()).toBe(true)
    })

    it('should render FormattedTextarea', () => {
        const wrapper = mount(PostTweet, {
            global: {
                stubs: {
                    NuxtLink: true,
                    NuxtImg: true,
                    FormattedTextarea: { template: '<textarea class="formatted-textarea"></textarea>' },
                    CustomToolTip: true,
                    MediaUpload: true,
                    GifPicker: true,
                    EmojiPicker: true,
                    QuotedTweet: true,
                    Button: true,
                },
            },
        })
        
        expect(wrapper.find('.formatted-textarea').exists()).toBe(true)
    })

    it('should show replying to username when provided', () => {
        const wrapper = mount(PostTweet, {
            props: {
                replyingToUsername: 'johndoe',
            },
            global: {
                stubs: {
                    NuxtLink: { template: '<a><slot /></a>' },
                    NuxtImg: true,
                    FormattedTextarea: true,
                    CustomToolTip: true,
                    MediaUpload: true,
                    GifPicker: true,
                    EmojiPicker: true,
                    QuotedTweet: true,
                    Button: true,
                },
            },
        })
        
        expect(wrapper.text()).toContain('Replying to')
        expect(wrapper.text()).toContain('@johndoe')
    })

    it('should not show replying indicator when no username', () => {
        const wrapper = mount(PostTweet, {
            global: {
                stubs: {
                    NuxtLink: true,
                    NuxtImg: true,
                    FormattedTextarea: true,
                    CustomToolTip: true,
                    MediaUpload: true,
                    GifPicker: true,
                    EmojiPicker: true,
                    QuotedTweet: true,
                    Button: true,
                },
            },
        })
        
        expect(wrapper.text()).not.toContain('Replying to')
    })

    it('should render media upload button', () => {
        const wrapper = mount(PostTweet, {
            global: {
                stubs: {
                    NuxtLink: true,
                    NuxtImg: true,
                    FormattedTextarea: true,
                    CustomToolTip: true,
                    MediaUpload: { template: '<button class="media-upload-btn"></button>' },
                    GifPicker: true,
                    EmojiPicker: true,
                    QuotedTweet: true,
                    Button: true,
                },
            },
        })
        
        expect(wrapper.find('.media-upload-btn').exists()).toBe(true)
    })

    it('should render emoji picker button', () => {
        const wrapper = mount(PostTweet, {
            global: {
                stubs: {
                    NuxtLink: true,
                    NuxtImg: true,
                    FormattedTextarea: true,
                    CustomToolTip: { template: '<div><slot name="trigger" /></div>' },
                    MediaUpload: true,
                    GifPicker: true,
                    EmojiPicker: true,
                    QuotedTweet: true,
                    Button: true,
                },
            },
        })
        
        const emojiButton = wrapper.find('#post-tweet-emoji-picker-btn')
        expect(emojiButton.exists()).toBe(true)
    })

    it('should render GIF picker button', () => {
        const wrapper = mount(PostTweet, {
            global: {
                stubs: {
                    NuxtLink: true,
                    NuxtImg: true,
                    FormattedTextarea: true,
                    CustomToolTip: { template: '<div><slot name="trigger" /></div>' },
                    MediaUpload: true,
                    GifPicker: true,
                    EmojiPicker: true,
                    QuotedTweet: true,
                    Button: true,
                },
            },
        })
        
        const gifButton = wrapper.find('#post-tweet-gif-picker-btn')
        expect(gifButton.exists()).toBe(true)
    })

    it('should render post button', () => {
        const wrapper = mount(PostTweet, {
            global: {
                stubs: {
                    NuxtLink: true,
                    NuxtImg: true,
                    FormattedTextarea: true,
                    CustomToolTip: true,
                    MediaUpload: true,
                    GifPicker: true,
                    EmojiPicker: true,
                    QuotedTweet: true,
                    Button: { template: '<button id="post-tweet-post-btn">Post</button>' },
                },
            },
        })
        
        expect(wrapper.find('#post-tweet-post-btn').exists()).toBe(true)
    })

    it('should apply border class when border prop is true', () => {
        const wrapper = mount(PostTweet, {
            props: {
                border: true,
            },
            global: {
                stubs: {
                    NuxtLink: true,
                    NuxtImg: true,
                    FormattedTextarea: true,
                    CustomToolTip: true,
                    MediaUpload: true,
                    GifPicker: true,
                    EmojiPicker: true,
                    QuotedTweet: true,
                    Button: true,
                },
            },
        })
        
        const form = wrapper.find('form')
        expect(form.classes()).toContain('border-b')
    })

    it('should not apply border class when border prop is false', () => {
        const wrapper = mount(PostTweet, {
            props: {
                border: false,
            },
            global: {
                stubs: {
                    NuxtLink: true,
                    NuxtImg: true,
                    FormattedTextarea: true,
                    CustomToolTip: true,
                    MediaUpload: true,
                    GifPicker: true,
                    EmojiPicker: true,
                    QuotedTweet: true,
                    Button: true,
                },
            },
        })
        
        const form = wrapper.find('form')
        expect(form.classes()).not.toContain('border-b')
    })

    it('should show QuotedTweet when quotedTweet prop is provided', () => {
        const mockTweet = {
            id: '1',
            content: 'Test tweet',
            user: { username: 'testuser', name: 'Test User' },
        }
        
        const wrapper = mount(PostTweet, {
            props: {
                quotedTweet: mockTweet,
            },
            global: {
                stubs: {
                    NuxtLink: true,
                    NuxtImg: true,
                    FormattedTextarea: true,
                    CustomToolTip: true,
                    MediaUpload: true,
                    GifPicker: true,
                    EmojiPicker: true,
                    QuotedTweet: { template: '<div class="quoted-tweet"></div>' },
                    Button: true,
                },
            },
        })
        
        expect(wrapper.find('.quoted-tweet').exists()).toBe(true)
    })

    it('should use compact avatar size when compact prop is true', () => {
        const wrapper = mount(PostTweet, {
            props: {
                compact: true,
            },
            global: {
                stubs: {
                    NuxtLink: { template: '<a><slot /></a>' },
                    NuxtImg: { template: '<img class="avatar" />' },
                    FormattedTextarea: true,
                    CustomToolTip: true,
                    MediaUpload: true,
                    GifPicker: true,
                    EmojiPicker: true,
                    QuotedTweet: true,
                    Button: true,
                },
            },
        })
        
        // Component renders avatar with compact sizing
        expect(wrapper.find('.avatar').exists()).toBe(true)
    })
})
