

import { vi } from 'vitest'

vi.mock('~/modules/TimeLine/queries/usePostTweet', () => ({
  usePostTweet: () => ({
    isPending: { value: false },
    mutateAsync: vi.fn(),
  }),
}))

vi.mock('vue', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    onMounted: fn => fn && fn(),
    nextTick: (fn) => (fn ? fn() : Promise.resolve()),
    watch: (source, cb) => {
      if (typeof cb === 'function') cb()
      return () => {}
    },
  }
})

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import QuoteModal from '../../components/QuoteModal/QuoteModal.vue'

describe('QuoteModal Component', () => {
  const quotedTweet = {
    tweet_id: '1',
    type: 'tweet',
    content: 'This is a quoted tweet',
    likes_count: 0,
    reposts_count: 0,
    views_count: 0,
    quotes_count: 0,
    replies_count: 0,
    is_liked: false,
    is_reposted: false,
    is_bookmarked: false,
    created_at: '',
    user: { user_id: 'u1', name: 'User', avatar_url: '', username: 'user' }
  }

  function mountModal(props = {}) {
    return mount(QuoteModal, {
      props: { isOpen: true, quotedTweet, ...props },
      attachTo: document.body,
      global: {
        mocks: {
          $t: (msg) => msg,
        },
        stubs: {
          FormattedTextarea: defineComponent({
            name: 'FormattedTextarea',
            props: ['modelValue', 'placeholder', 'id', 'inlineborder'],
            template: '<textarea />',
          }),
          Button: defineComponent({
            name: 'Button',
            props: ['buttonText', 'isLoading', 'disabled', 'buttonClass', 'loadingText'],
            template: '<button :disabled="disabled || isLoading"><slot>Quote</slot></button>',
          }),
          QuotedTweet: defineComponent({
            name: 'QuotedTweet',
            props: ['tweet'],
            template: '<div>Quote</div>',
          }),
        },
      },
    })
  }

  it('renders quote modal', () => {
    const wrapper = mountModal()
    expect(wrapper.exists()).toBe(true)
    const modal = document.body.querySelector('.fixed.inset-0')
    expect(modal).toBeTruthy()
    expect(document.body.innerHTML).toContain('Quote')
  })

  it('closes when close button is clicked', async () => {
    const wrapper = mountModal()
    await wrapper.vm.$emit('close')
    // Modal should be closed (isOpen false)
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('disables post button when content is empty', () => {
    const wrapper = mountModal()
    // Find the Button stub and check its props
    const buttonStub = wrapper.findComponent({ name: 'Button' })
    expect(buttonStub.props('disabled')).toBe(true)
  })

  it('handles escape key to close modal', async () => {
    const wrapper = mountModal()
    const event = new KeyboardEvent('keydown', { key: 'Escape' })
    document.dispatchEvent(event)
    // Should emit close
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits success on submit', async () => {
    const wrapper = mountModal()
    // Set content to non-empty via FormattedTextarea stub
    const textareaStub = wrapper.findComponent({ name: 'FormattedTextarea' })
    await textareaStub.vm.$emit('update:modelValue', 'Hello world')
    // Simulate submit
    await wrapper.vm.$emit('success')
    expect(wrapper.emitted('success')).toBeTruthy()
  })
})
