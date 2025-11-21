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
        { name: 'Default', value: 'light', description: 'Default' },
        { name: 'Lights out', value: 'dark', description: 'Lights out' },
    ]

    const fontSize = ref(3)
    const color = ref('blue')
    const background = ref('dark')
    const useSystemTheme = ref(false)

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

        if (useSystemTheme.value) {
            applySystemTheme()
        } else {
            if (background.value === 'dark') {
                document.documentElement.classList.add('dark')
                console.log('dark mode applied')
            } else {
                document.documentElement.classList.remove('dark')
                console.log('light mode applied')
            }
        }
    }

    const applyFontSize = () => {
        const fontSizeMap: Record<string, string> = {
            '1': '13px',
            '2': '15px',
            '3': '16px',
            '4': '18px',
            '5': '20px',
        }
        document.documentElement.style.fontSize = fontSizeMap[fontSize.value.toString()] || '16px'
    }

    const applyColor = () => {
        document.documentElement.setAttribute('data-color', color.value)
    }

    const applyBackground = () => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const systemBackground = prefersDark ? 'dark' : 'light'
        console.log('applyBackground system', systemBackground)
        console.log('applyBackground background', background.value)

        if (useSystemTheme.value && background.value !== systemBackground) {
            useSystemTheme.value = false
            localStorage.setItem(STORAGE_KEYS.USE_SYSTEM, JSON.stringify(false))
            console.log('applyBackground background inside if', background.value)
        }

        if (background.value === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    const applySystemTheme = () => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const systemBackground = prefersDark ? 'dark' : 'light'

        if (useSystemTheme.value) {
            if (background.value !== systemBackground) {
                background.value = systemBackground
                localStorage.setItem(STORAGE_KEYS.BACKGROUND, systemBackground)
            }
            document.documentElement.classList.toggle('dark', prefersDark)
        }
    }

    watch(fontSize, () => {
        localStorage.setItem(STORAGE_KEYS.FONT_SIZE, JSON.stringify(fontSize.value))
        applyFontSize()
    })

    watch(color, () => {
        localStorage.setItem(STORAGE_KEYS.COLOR, color.value)
        applyColor()
    })

    watch(background, () => {
        console.log('back changes', background.value)
        localStorage.setItem(STORAGE_KEYS.BACKGROUND, background.value)
        applyBackground()
    })

    watch(useSystemTheme, (newValue, oldValue) => {
        console.log('useSystemTheme changes from ', oldValue, 'to', newValue)
        localStorage.setItem(STORAGE_KEYS.USE_SYSTEM, JSON.stringify(useSystemTheme.value))
        // only apply system theme if user is turning it on
        if (newValue === true) {
            applySystemTheme()
        } else {
            console.log('turn off system theme')
        }
    })

    onMounted(() => {
        loadSettings()

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleSystemThemeChange = () => {
            if (useSystemTheme.value) {
                console.log('System theme changed, applying...')
                applySystemTheme()
            }
        }
        mediaQuery.addEventListener('change', handleSystemThemeChange)
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
