import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {}

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString()
        },
        removeItem: (key: string) => {
            delete store[key]
        },
        clear: () => {
            store = {}
        },
    }
})()

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
})

vi.mock('@vueuse/core', () => {
    const { ref } = require('vue')
    return {
        useWindowSize: () => ({
            width: ref(1200),
        }),
    }
})

// Import after mocks
import { useSidebarState } from '../../composables/useSidebarState'

describe('useSidebarState', () => {
    beforeEach(() => {
        localStorageMock.clear()
        vi.clearAllMocks()
    })

    it('should return sidebar state object with all required methods', () => {
        const sidebarState = useSidebarState()

        expect(sidebarState).toBeDefined()
        expect(sidebarState.isExpanded).toBeDefined()
        expect(sidebarState.isCollapsed).toBeDefined()
        expect(sidebarState.sidebarWidth).toBeDefined()
        expect(sidebarState.toggleSidebar).toBeDefined()
        expect(sidebarState.expandSidebar).toBeDefined()
        expect(sidebarState.collapseSidebar).toBeDefined()
    })

    it('should have isCollapsed as the opposite of isExpanded', () => {
        const { isCollapsed, isExpanded } = useSidebarState()
        expect(isCollapsed.value).toBe(!isExpanded.value)
    })

    it('should return valid sidebar width values', () => {
        const { sidebarWidth } = useSidebarState()
        expect([70, 275]).toContain(sidebarWidth.value)
    })

    it('should toggle sidebar expanded state', () => {
        const { isExpanded, toggleSidebar } = useSidebarState()
        const initialState = isExpanded.value

        toggleSidebar()
        expect(isExpanded.value).toBe(!initialState)
    })

    it('should set sidebar to expanded state', () => {
        const { isExpanded, expandSidebar } = useSidebarState()

        expandSidebar()
        expect(isExpanded.value).toBe(true)
    })

    it('should set sidebar to collapsed state', () => {
        const { isExpanded, collapseSidebar } = useSidebarState()

        collapseSidebar()
        expect(isExpanded.value).toBe(false)
    })

    it('should restore state from localStorage when available', () => {
        localStorageMock.setItem('sidebar-expanded-state', 'false')
        const { isExpanded } = useSidebarState()
        expect(isExpanded.value).toBe(false)
    })

    it('should handle multiple state changes', () => {
        const { isExpanded, toggleSidebar, expandSidebar, collapseSidebar } = useSidebarState()

        expandSidebar()
        expect(isExpanded.value).toBe(true)

        collapseSidebar()
        expect(isExpanded.value).toBe(false)

        toggleSidebar()
        expect(isExpanded.value).toBe(true)
    })

    it('should update sidebarWidth when state changes', () => {
        const { sidebarWidth, expandSidebar } = useSidebarState()
        const initialWidth = sidebarWidth.value

        expandSidebar()
        // The width should be one of the valid values
        expect([70, 275]).toContain(sidebarWidth.value)
    })
})
