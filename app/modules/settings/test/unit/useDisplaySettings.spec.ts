import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { useDisplaySettings } from '../../composables/useDisplaySettings'

function mountComposable() {
    return mount(
        defineComponent({
            setup() {
                const result = useDisplaySettings()
                return result
            },
            template: '<div></div>',
        }),
    )
}

function mockMatchMedia(dark = false) {
    return {
        matches: dark,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    }
}

describe('useDisplaySettings composable', () => {
    beforeEach(() => {
        document.documentElement.className = ''
        document.documentElement.style.fontSize = ''
        document.documentElement.removeAttribute('data-color')

        localStorage.clear()
        window.matchMedia = vi.fn().mockImplementation(() => mockMatchMedia(false))
    })

    it('loads settings from localStorage and applies them', async () => {
        localStorage.setItem('yapper-font-size', '5')
        localStorage.setItem('yapper-color', 'pink')
        localStorage.setItem('yapper-theme', 'dark')
        localStorage.setItem('yapper-use-system-theme', 'false')

        mountComposable()
        await nextTick()

        expect(document.documentElement.style.fontSize).toBe('20px')
        expect(document.documentElement.getAttribute('data-color')).toBe('pink')
        expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('changes font size and updates DOM + localStorage', async () => {
        const wrapper = mountComposable()
        wrapper.vm.fontSize = 1
        await nextTick()

        expect(document.documentElement.style.fontSize).toBe('13px')
        expect(localStorage.getItem('yapper-font-size')).toBe('1')
    })

    it('changes color and updates DOM + localStorage', async () => {
        const wrapper = mountComposable()
        wrapper.vm.color = 'purple'
        await nextTick()

        expect(document.documentElement.getAttribute('data-color')).toBe('purple')
        expect(localStorage.getItem('yapper-color')).toBe('purple')
    })

    it('changes background and toggles dark theme class', async () => {
        const wrapper = mountComposable()
        wrapper.vm.background = 'dark'
        await nextTick()

        expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('system theme overrides background when useSystemTheme = true', async () => {
        window.matchMedia = vi.fn().mockImplementation(() => mockMatchMedia(true))

        const wrapper = mountComposable()
        wrapper.vm.useSystemTheme = true
        await nextTick()

        expect(wrapper.vm.background).toBe('dark')
        expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('adds system theme listener on mounted', () => {
        const media = mockMatchMedia(false)
        window.matchMedia = vi.fn().mockReturnValue(media)

        mountComposable()

        expect(media.addEventListener).toHaveBeenCalled()
    })

    it('applies light mode when background is light', async () => {
        const wrapper = mountComposable()
        wrapper.vm.background = 'light'
        await nextTick()

        expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('disables system theme if background mismatches system preference', async () => {
        window.matchMedia = vi.fn().mockImplementation(
            () => mockMatchMedia(true), // system prefers dark
        )

        const wrapper = mountComposable()

        wrapper.vm.useSystemTheme = true
        await nextTick()

        wrapper.vm.background = 'light'
        await nextTick()

        expect(wrapper.vm.useSystemTheme).toBe(false)
        expect(localStorage.getItem('yapper-use-system-theme')).toBe('false')
    })

    it('applySystemTheme switches to light when system prefers light', async () => {
        window.matchMedia = vi.fn().mockImplementation(() => mockMatchMedia(false))

        const wrapper = mountComposable()
        wrapper.vm.useSystemTheme = true
        await nextTick()

        expect(wrapper.vm.background).toBe('light')
        expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('turning off system theme does not reapply system theme', async () => {
        const wrapper = mountComposable()

        wrapper.vm.useSystemTheme = true
        await nextTick()

        wrapper.vm.useSystemTheme = false
        await nextTick()

        expect(localStorage.getItem('yapper-use-system-theme')).toBe('false')
    })

    it('font size falls back to default when invalid value', async () => {
        const wrapper = mountComposable()

        wrapper.vm.fontSize = 99
        await nextTick()

        expect(document.documentElement.style.fontSize).toBe('16px')
    })


    it('reacts to system theme change event', async () => {
        const media = mockMatchMedia(true)
        window.matchMedia = vi.fn().mockReturnValue(media)

        const wrapper = mountComposable()
        wrapper.vm.useSystemTheme = true
        await nextTick()

        media.matches = false
        media.addEventListener.mock.calls[0][1]()

        expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

})

