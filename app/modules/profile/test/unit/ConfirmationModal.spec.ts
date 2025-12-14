import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import ConfirmationModal from '../../components/ProfileHeader/SubComponents/ConfirmtionModal.vue'

describe('ConfirmationModal', () => {
    it('does not render when showConfirmation is false', () => {
        const wrapper = mount(ConfirmationModal, {
            global: {
                provide: {
                    confirmation: {
                        showConfirmation: ref(false),
                        confirmData: ref({
                            header: 'Test Header',
                            action: 'Test Action',
                            bgColor: 'bg-red',
                            hover: 'hover:bg-red',
                            text: 'text-white',
                            message: 'Test message',
                            username: 'testuser',
                            handleClick: vi.fn()
                        })
                    }
                },
                stubs: {
                    Button: {
                        template: '<button @click="$emit(\'click\')"><slot /></button>',
                        props: ['buttonClass', 'class']
                    }
                }
            }
        })

        expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
    })

    it('renders when showConfirmation is true', () => {
        const wrapper = mount(ConfirmationModal, {
            global: {
                provide: {
                    confirmation: {
                        showConfirmation: ref(true),
                        confirmData: ref({
                            header: 'Test Header',
                            action: 'Test Action',
                            bgColor: 'bg-red',
                            hover: 'hover:bg-red',
                            text: 'text-white',
                            message: 'Test message',
                            username: 'testuser',
                            handleClick: vi.fn()
                        })
                    }
                },
                stubs: {
                    Button: {
                        template: '<button @click="$emit(\'click\')"><slot /></button>',
                        props: ['buttonClass', 'class']
                    }
                }
            }
        })

        expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)
        expect(wrapper.text()).toContain('Test Header')
        expect(wrapper.text()).toContain('@testuser?')
        expect(wrapper.text()).toContain('Test message')
        expect(wrapper.text()).toContain('Test Action')
    })

    it('calls handleClick when confirm button is clicked', async () => {
        const handleClickMock = vi.fn()
        const showConfirmation = ref(true)

        const wrapper = mount(ConfirmationModal, {
            global: {
                provide: {
                    confirmation: {
                        showConfirmation,
                        confirmData: ref({
                            header: 'Test Header',
                            action: 'Test Action',
                            bgColor: 'bg-red',
                            hover: 'hover:bg-red',
                            text: 'text-white',
                            message: 'Test message',
                            username: 'testuser',
                            handleClick: handleClickMock
                        })
                    }
                },
                stubs: {
                    Button: {
                        template: '<button :id="id" @click="$emit(\'click\')"><slot /></button>',
                        props: ['buttonClass', 'class', 'id']
                    }
                }
            }
        })

        await wrapper.find('#confirm-button').trigger('click')

        expect(handleClickMock).toHaveBeenCalled()
        expect(showConfirmation.value).toBe(false)
    })

    it('closes modal when cancel button is clicked', async () => {
        const showConfirmation = ref(true)

        const wrapper = mount(ConfirmationModal, {
            global: {
                provide: {
                    confirmation: {
                        showConfirmation,
                        confirmData: ref({
                            header: 'Test Header',
                            action: 'Test Action',
                            bgColor: 'bg-red',
                            hover: 'hover:bg-red',
                            text: 'text-white',
                            message: 'Test message',
                            username: 'testuser',
                            handleClick: vi.fn()
                        })
                    }
                },
                stubs: {
                    Button: {
                        template: '<button :id="id" @click="$emit(\'click\')"><slot /></button>',
                        props: ['buttonClass', 'class', 'id']
                    }
                }
            }
        })

        await wrapper.find('#cancel-confirm-button').trigger('click')

        expect(showConfirmation.value).toBe(false)
    })

    it('closes modal when backdrop is clicked', async () => {
        const showConfirmation = ref(true)

        const wrapper = mount(ConfirmationModal, {
            global: {
                provide: {
                    confirmation: {
                        showConfirmation,
                        confirmData: ref({
                            header: 'Test Header',
                            action: 'Test Action',
                            bgColor: 'bg-red',
                            hover: 'hover:bg-red',
                            text: 'text-white',
                            message: 'Test message',
                            username: 'testuser',
                            handleClick: vi.fn()
                        })
                    }
                },
                stubs: {
                    Button: {
                        template: '<button @click="$emit(\'click\')"><slot /></button>',
                        props: ['buttonClass', 'class']
                    }
                }
            }
        })

        await wrapper.find('.fixed.inset-0').trigger('click')

        expect(showConfirmation.value).toBe(false)
    })

    it('does not show username when username is empty', () => {
        const wrapper = mount(ConfirmationModal, {
            global: {
                provide: {
                    confirmation: {
                        showConfirmation: ref(true),
                        confirmData: ref({
                            header: 'Test Header',
                            action: 'Test Action',
                            bgColor: 'bg-red',
                            hover: 'hover:bg-red',
                            text: 'text-white',
                            message: 'Test message',
                            username: '',
                            handleClick: vi.fn()
                        })
                    }
                },
                stubs: {
                    Button: {
                        template: '<button @click="$emit(\'click\')"><slot /></button>',
                        props: ['buttonClass', 'class']
                    }
                }
            }
        })

        expect(wrapper.text()).not.toContain('@')
        expect(wrapper.text()).toContain('Test Header')
    })

    it('does not close modal when clicking inside modal content', async () => {
        const showConfirmation = ref(true)

        const wrapper = mount(ConfirmationModal, {
            global: {
                provide: {
                    confirmation: {
                        showConfirmation,
                        confirmData: ref({
                            header: 'Test Header',
                            action: 'Test Action',
                            bgColor: 'bg-red',
                            hover: 'hover:bg-red',
                            text: 'text-white',
                            message: 'Test message',
                            username: 'testuser',
                            handleClick: vi.fn()
                        })
                    }
                },
                stubs: {
                    Button: {
                        template: '<button @click="$emit(\'click\')"><slot /></button>',
                        props: ['buttonClass', 'class']
                    }
                }
            }
        })

        await wrapper.find('.bg-primary.text-primary').trigger('click')

        expect(showConfirmation.value).toBe(true)
    })
})
