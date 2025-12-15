import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed, nextTick } from 'vue'
import DisplaySettings from '../../components/Display/DisplaySettings.vue'
import { useDisplaySettings } from '../../composables/useDisplaySettings'

vi.mock('~/modules/settings/composables/useDisplaySettings', () => ({
    useDisplaySettings: vi.fn(),
}))

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
    }),
}))

const color = ref('blue')
const background = ref('light')
const useSystemTheme = ref(false)
const fontSize = ref(3)

const colorOptions = [
    { name: 'Blue', value: 'blue', class: 'bg-blue' },
    { name: 'Red', value: 'red', class: 'bg-red' },
]

const backgroundOptions = [
    { value: 'light', description: 'Light' },
    { value: 'dark', description: 'Dark' },
]

const mockDisplaySettings = {
    color: computed({
        get: () => color.value,
        set: (val) => {
            color.value = val
        },
    }),
    background: computed({
        get: () => background.value,
        set: (val) => {
            background.value = val
        },
    }),
    useSystemTheme: computed({
        get: () => useSystemTheme.value,
        set: (val) => {
            useSystemTheme.value = val
        },
    }),
    fontSize: computed(() => fontSize.value),
    colorOptions,
    backgroundOptions,
}

describe('DisplaySettings', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(useDisplaySettings).mockReturnValue(
            mockDisplaySettings as unknown as ReturnType<typeof useDisplaySettings>,
        )
        color.value = 'blue'
        background.value = 'light'
        useSystemTheme.value = false
    })

    const mountComponent = () =>
        mount(DisplaySettings, {
            global: { mocks: { $t: (str: string) => str } },
        })

    it('renders all main sections', () => {
        const wrapper = mountComponent()
        expect(wrapper.text()).toContain('settings.color')
        expect(wrapper.text()).toContain('settings.background')
        expect(wrapper.text()).toContain('settings.useSystemSetting')
    })

    it('updates selected color when clicking a color option', async () => {
        const wrapper = mountComponent()
        const redBtn = wrapper.find('#btn-color-red')
        await redBtn.trigger('click')

        expect(color.value).toBe('red')
    })

    it('updates background when clicking a background button', async () => {
        const wrapper = mountComponent()
        const darkBtn = wrapper.find('#btn-background-dark')
        await darkBtn.trigger('click')

        expect(background.value).toBe('dark')
    })

    it('toggles system theme switch on click', async () => {
        const wrapper = mountComponent()
        const switchBtn = wrapper.find('#btn-use-system-theme')
        await switchBtn.trigger('click')

        expect(useSystemTheme.value).toBe(true)
    })

    it('reactively updates the UI when buttonText changes', async () => {
        const wrapper = mountComponent()
        expect(wrapper.find('[role="switch"]').attributes('aria-checked')).toBe('false')

        useSystemTheme.value = true
        await nextTick()

        expect(wrapper.find('[role="switch"]').attributes('aria-checked')).toBe('true')
    })
})
