import { ref, watch, onMounted } from 'vue'
export const useDisplaySettings = () => {
    const STORAGE_KEYS = {
        FONT_SIZE: 'yapper-font-size',
        COLOR: 'yapper-color',
        BACKGROUND: 'yapper-theme',
        USE_SYSTEM: 'yapper-use-system-theme',
    }

    const colorOptions = [
        { name: 'Blue', value: 'blue', class: 'bg-[#1d9bf0]' },
        { name: 'Yellow', value: 'yellow', class: 'bg-[#ffd400]' },
        { name: 'Pink', value: 'pink', class: 'bg-[#f91880]' },
        { name: 'Purple', value: 'purple', class: 'bg-[#7856ff]' },
        { name: 'Orange', value: 'orange', class: 'bg-[#ff7a00]' },
        { name: 'Green', value: 'green', class: 'bg-[#00ba7c]' },
    ]

    const backgroundOptions = [
        { name: 'Default', value: 'default', description: 'Default' },
        { name: 'Lights out', value: 'dark', description: 'Lights out' },
    ]

    const fontSize = ref(3)
    const color = ref('blue')
    const background = ref('dark')
    const useSystemTheme = ref(false)

    const saveSettings = () => {
        localStorage.setItem(STORAGE_KEYS.FONT_SIZE, JSON.stringify(fontSize.value))
        localStorage.setItem(STORAGE_KEYS.COLOR, color.value)
        localStorage.setItem(STORAGE_KEYS.BACKGROUND, background.value)
        localStorage.setItem(STORAGE_KEYS.USE_SYSTEM, JSON.stringify(useSystemTheme.value))
    }

    const loadSettings = () => {
        fontSize.value = JSON.parse(localStorage.getItem(STORAGE_KEYS.FONT_SIZE) || '3')
        color.value = localStorage.getItem(STORAGE_KEYS.COLOR) || 'blue'
        background.value = localStorage.getItem(STORAGE_KEYS.BACKGROUND) || 'dark'
        useSystemTheme.value = JSON.parse(localStorage.getItem(STORAGE_KEYS.USE_SYSTEM) || 'false')

        applySettings()
    }

    const applySettings = () => {
        if (typeof document === 'undefined') return
        const fontSizeMap: Record<string, string> = {
            '1': '13px',
            '2': '15px',
            '3': '16px',
            '4': '18px',
            '5': '20px',
        }
        document.documentElement.style.fontSize = fontSizeMap[fontSize.value.toString()] || '16px'
        document.documentElement.setAttribute('data-color', color.value)
        if (background.value === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    watch([fontSize, color, background, useSystemTheme], () => {
        saveSettings()
        applySettings()
    })

    onMounted(() => {
        loadSettings()
    })

    return {
        fontSize,
        color,
        background,
        useSystemTheme,
        colorOptions,
        backgroundOptions,
    }
}
