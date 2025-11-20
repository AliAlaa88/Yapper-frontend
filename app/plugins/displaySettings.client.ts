export default defineNuxtPlugin(() => {
    if (import.meta.client) {
        const STORAGE_KEYS = {
            FONT_SIZE: 'yapper-font-size',
            COLOR: 'yapper-color',
            BACKGROUND: 'yapper-theme',
            USE_SYSTEM: 'yapper-use-system-theme',
        }

        const applyFontSize = () => {
            const root = document.documentElement
            const fontSize = localStorage.getItem(STORAGE_KEYS.FONT_SIZE) || '3'

            const fontSizeMap: Record<string, string> = {
                '1': '13px',
                '2': '15px',
                '3': '16px',
                '4': '18px',
                '5': '20px',
            }
            root.style.fontSize = fontSizeMap[fontSize] || '16px'
        }

        const applyColor = () => {
            const root = document.documentElement
            const color = localStorage.getItem(STORAGE_KEYS.COLOR) || 'blue'
            root.setAttribute('data-color', color)
        }


        const applyBackground = () => {
            const root = document.documentElement
            const useSystem = localStorage.getItem(STORAGE_KEYS.USE_SYSTEM) === 'true'
            const background = localStorage.getItem(STORAGE_KEYS.BACKGROUND) || 'dark'

            if (useSystem) {
                // Use system preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                root.classList.toggle('dark', prefersDark)
            } else {
                // Use manual selection
                if (background === 'dark') {
                    root.classList.add('dark')
                } else {
                    root.classList.remove('dark')
                }
            }
        }


        const applyInitialSettings = () => {
            applyFontSize()
            applyColor()
            applyBackground()
        }

        applyInitialSettings()

        window.addEventListener('storage', (e) => {
            if (!e.key) return

            if (e.key === STORAGE_KEYS.FONT_SIZE) applyFontSize()
            if (e.key === STORAGE_KEYS.COLOR) applyColor()
            if (e.key === STORAGE_KEYS.BACKGROUND || e.key === STORAGE_KEYS.USE_SYSTEM) {
                applyBackground()
            }
        })

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        mediaQuery.addEventListener('change', () => {
            const useSystem = localStorage.getItem(STORAGE_KEYS.USE_SYSTEM) === 'true'
            if (useSystem) {
                applyBackground()
            }
        })
    }
})
