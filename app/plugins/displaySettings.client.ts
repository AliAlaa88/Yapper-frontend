export default defineNuxtPlugin(() => {
    if (import.meta.client) {
        const STORAGE_KEYS = {
            FONT_SIZE: 'yapper-font-size',
            COLOR: 'yapper-color',
            BACKGROUND: 'yapper-theme',
            USE_SYSTEM: 'yapper-use-system-theme',
        }

        const applyInitialSettings = () => {
            const root = document.documentElement
            const fontSize = localStorage.getItem(STORAGE_KEYS.FONT_SIZE) || '3'
            const color = localStorage.getItem(STORAGE_KEYS.COLOR) || 'blue'
            const background = localStorage.getItem(STORAGE_KEYS.BACKGROUND) || 'dark'
            const useSystem = localStorage.getItem(STORAGE_KEYS.USE_SYSTEM) === 'true'

            const fontSizeMap: Record<string, string> = {
                '1': '13px',
                '2': '15px',
                '3': '16px',
                '4': '18px',
                '5': '20px',
            }
            root.style.fontSize = fontSizeMap[fontSize] || '16px'
            root.setAttribute('data-color', color)

            // Apply background
            // if (useSystem) {
            //     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            //     root.classList.toggle('dark', prefersDark)
            // } else {
            if (background === 'dark') {
                root.classList.add('dark')
            } else {
                root.classList.remove('dark')
            }
            // }
        }

        applyInitialSettings()

        window.addEventListener('storage', (e) => {
            if (e.key?.startsWith('yapper-')) {
                applyInitialSettings()
            }
        })
    }
})
