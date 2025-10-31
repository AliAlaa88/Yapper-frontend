import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Publisher from '../../components/Tweet/subComponents/Publisher/Publisher.vue'
import type { User } from '../../types'

// Mock the utility functions
vi.mock('../../utils/lib', () => ({
    formatDate: vi.fn((date) => '2h'), // Mock return value
}))

vi.mock('../../utils/navigation', () => ({
    getProfileUrl: vi.fn((user) => user.link || `/profile/${user.username}`),
}))

describe('Publisher Component', () => {
    const mockPublisher: User = {
        id: 'user1',
        name: 'John Doe',
        username: 'johndoe',
        avatar: '/avatars/john.jpg',
        link: '',
    }

    const mockCreatedAt = '2025-10-17T12:00:00.000Z'

    describe('Timeline View (isDetail = false)', () => {
        it('renders publisher info in inline format', () => {
            const wrapper = mount(Publisher, {
                props: {
                    publisher: mockPublisher,
                    createdAt: mockCreatedAt,
                    isDetail: false,
                },
                global: {
                    stubs: {
                        NuxtLink: {
                            template: '<a :href="to"><slot /></a>',
                            props: ['to'],
                        },
                    },
                },
            })

            // Should have inline layout (single div)
            const container = wrapper.find('.flex.items-center.gap-1')
            expect(container.exists()).toBe(true)

            // Should not have detail view container
            const detailView = wrapper.find('.mb-4 > .flex.items-center.gap-3')
            expect(detailView.exists()).toBe(false)
        })

        it('displays name as a link', () => {
            const wrapper = mount(Publisher, {
                props: {
                    publisher: mockPublisher,
                    createdAt: mockCreatedAt,
                    isDetail: false,
                },
                global: {
                    stubs: {
                        NuxtLink: {
                            template: '<a :href="to"><slot /></a>',
                            props: ['to'],
                        },
                    },
                },
            })

            const nameLink = wrapper.find('a')
            expect(nameLink.text()).toBe('John Doe')
            expect(nameLink.attributes('href')).toBe('/profile/johndoe')
        })

        it('displays username with @ symbol', () => {
            const wrapper = mount(Publisher, {
                props: {
                    publisher: mockPublisher,
                    createdAt: mockCreatedAt,
                    isDetail: false,
                },
                global: {
                    stubs: {
                        NuxtLink: {
                            template: '<a :href="to"><slot /></a>',
                            props: ['to'],
                        },
                    },
                },
            })

            const username = wrapper.findAll('span')[0]
            expect(username?.text()).toBe('@johndoe')
        })

        it('displays formatted date', () => {
            const wrapper = mount(Publisher, {
                props: {
                    publisher: mockPublisher,
                    createdAt: mockCreatedAt,
                    isDetail: false,
                },
                global: {
                    stubs: {
                        NuxtLink: {
                            template: '<a :href="to"><slot /></a>',
                            props: ['to'],
                        },
                    },
                },
            })

            // Last span should be the date
            const spans = wrapper.findAll('span')
            const dateSpan = spans[spans.length - 1]
            expect(dateSpan?.text()).toBe('2h')
        })

        it('includes separator dot between elements', () => {
            const wrapper = mount(Publisher, {
                props: {
                    publisher: mockPublisher,
                    createdAt: mockCreatedAt,
                    isDetail: false,
                },
                global: {
                    stubs: {
                        NuxtLink: {
                            template: '<a :href="to"><slot /></a>',
                            props: ['to'],
                        },
                    },
                },
            })

            const separator = wrapper.findAll('span')[1]
            expect(separator?.text()).toBe('·')
        })
    })

    describe('Detail View (isDetail = true)', () => {
        it('renders publisher info in stacked format', () => {
            const wrapper = mount(Publisher, {
                props: {
                    publisher: mockPublisher,
                    createdAt: mockCreatedAt,
                    isDetail: true,
                },
                global: {
                    stubs: {
                        NuxtLink: {
                            template: '<a :href="to"><slot /></a>',
                            props: ['to'],
                        },
                    },
                },
            })

            // Should have detail view container
            const detailView = wrapper.find('.mb-4')
            expect(detailView.exists()).toBe(true)

            // Should not have inline view
            const inlineView = wrapper.find('.flex.items-center.gap-1.mb-0\\.5')
            expect(inlineView.exists()).toBe(false)
        })

        it('displays avatar image in detail view', () => {
            const wrapper = mount(Publisher, {
                props: {
                    publisher: mockPublisher,
                    createdAt: mockCreatedAt,
                    isDetail: true,
                },
                global: {
                    stubs: {
                        NuxtLink: {
                            template: '<a :href="to"><slot /></a>',
                            props: ['to'],
                        },
                    },
                },
            })

            const avatar = wrapper.find('img')
            expect(avatar.exists()).toBe(true)
            expect(avatar.attributes('src')).toBe('/avatars/john.jpg')
            expect(avatar.attributes('alt')).toBe('John Doe')
            expect(avatar.classes()).toContain('w-12')
            expect(avatar.classes()).toContain('h-12')
            expect(avatar.classes()).toContain('rounded-full')
        })

        it('displays name and username in stacked layout', () => {
            const wrapper = mount(Publisher, {
                props: {
                    publisher: mockPublisher,
                    createdAt: mockCreatedAt,
                    isDetail: true,
                },
                global: {
                    stubs: {
                        NuxtLink: {
                            template: '<a :href="to"><slot /></a>',
                            props: ['to'],
                        },
                    },
                },
            })

            const nameLink = wrapper.find('a')
            expect(nameLink.text()).toBe('John Doe')
            expect(nameLink.classes()).toContain('text-[20px]') // Larger font in detail view

            const username = wrapper.find('span')
            expect(username.text()).toBe('@johndoe')
        })

        it('does not display date in detail view', () => {
            const wrapper = mount(Publisher, {
                props: {
                    publisher: mockPublisher,
                    createdAt: mockCreatedAt,
                    isDetail: true,
                },
                global: {
                    stubs: {
                        NuxtLink: {
                            template: '<a :href="to"><slot /></a>',
                            props: ['to'],
                        },
                    },
                },
            })

            // In detail view, formatDate shouldn't be called/displayed
            const html = wrapper.html()
            expect(html).not.toContain('2h')
        })
    })

    describe('Profile URL Generation', () => {
        it('uses custom link when provided', () => {
            const publisherWithLink: User = {
                ...mockPublisher,
                link: '/custom/profile',
            }

            const wrapper = mount(Publisher, {
                props: {
                    publisher: publisherWithLink,
                    createdAt: mockCreatedAt,
                    isDetail: false,
                },
                global: {
                    stubs: {
                        NuxtLink: {
                            template: '<a :href="to"><slot /></a>',
                            props: ['to'],
                        },
                    },
                },
            })

            const link = wrapper.find('a')
            expect(link.attributes('href')).toBe('/custom/profile')
        })

        it('generates profile URL from username when no custom link', () => {
            const wrapper = mount(Publisher, {
                props: {
                    publisher: mockPublisher,
                    createdAt: mockCreatedAt,
                    isDetail: false,
                },
                global: {
                    stubs: {
                        NuxtLink: {
                            template: '<a :href="to"><slot /></a>',
                            props: ['to'],
                        },
                    },
                },
            })

            const link = wrapper.find('a')
            expect(link.attributes('href')).toBe('/profile/johndoe')
        })
    })

    describe('Prop Reactivity', () => {
        it('updates when isDetail prop changes', async () => {
            const wrapper = mount(Publisher, {
                props: {
                    publisher: mockPublisher,
                    createdAt: mockCreatedAt,
                    isDetail: false,
                },
                global: {
                    stubs: {
                        NuxtLink: {
                            template: '<a :href="to"><slot /></a>',
                            props: ['to'],
                        },
                    },
                },
            })

            // Start with timeline view
            expect(wrapper.find('.flex.items-center.gap-1').exists()).toBe(true)
            expect(wrapper.find('img').exists()).toBe(false)

            // Switch to detail view
            await wrapper.setProps({ isDetail: true })

            expect(wrapper.find('.flex.items-center.gap-1.mb-0\\.5').exists()).toBe(false)
            expect(wrapper.find('img').exists()).toBe(true)
        })

        it('renders different publishers correctly', () => {
            const publisher1: User = {
                id: 'user1',
                name: 'John Doe',
                username: 'johndoe',
                avatar: '/avatars/john.jpg',
                link: '',
            }

            const wrapper1 = mount(Publisher, {
                props: {
                    publisher: publisher1,
                    createdAt: mockCreatedAt,
                    isDetail: false,
                },
                global: {
                    stubs: {
                        NuxtLink: {
                            template: '<a :href="to"><slot /></a>',
                            props: ['to'],
                        },
                    },
                },
            })

            expect(wrapper1.text()).toContain('John Doe')
            expect(wrapper1.text()).toContain('@johndoe')

            const publisher2: User = {
                id: 'user2',
                name: 'Jane Smith',
                username: 'janesmith',
                avatar: '/avatars/jane.jpg',
                link: '',
            }

            const wrapper2 = mount(Publisher, {
                props: {
                    publisher: publisher2,
                    createdAt: mockCreatedAt,
                    isDetail: false,
                },
                global: {
                    stubs: {
                        NuxtLink: {
                            template: '<a :href="to"><slot /></a>',
                            props: ['to'],
                        },
                    },
                },
            })

            expect(wrapper2.text()).toContain('Jane Smith')
            expect(wrapper2.text()).toContain('@janesmith')
        })
    })

    describe('CSS Classes', () => {
        it('applies correct classes for timeline view', () => {
            const wrapper = mount(Publisher, {
                props: {
                    publisher: mockPublisher,
                    createdAt: mockCreatedAt,
                    isDetail: false,
                },
                global: {
                    stubs: {
                        NuxtLink: {
                            template: '<a :href="to"><slot /></a>',
                            props: ['to'],
                        },
                    },
                },
            })

            const nameLink = wrapper.find('a')
            expect(nameLink.classes()).toContain('text-[15px]')
            expect(nameLink.classes()).toContain('font-bold')
            expect(nameLink.classes()).toContain('hover:underline')
        })

        it('applies correct classes for detail view', () => {
            const wrapper = mount(Publisher, {
                props: {
                    publisher: mockPublisher,
                    createdAt: mockCreatedAt,
                    isDetail: true,
                },
                global: {
                    stubs: {
                        NuxtLink: {
                            template: '<a :href="to"><slot /></a>',
                            props: ['to'],
                        },
                    },
                },
            })

            const nameLink = wrapper.find('a')
            expect(nameLink.classes()).toContain('text-[20px]')
            expect(nameLink.classes()).toContain('leading-6')
            expect(nameLink.classes()).toContain('font-bold')
            expect(nameLink.classes()).toContain('hover:underline')
        })
    })
})
