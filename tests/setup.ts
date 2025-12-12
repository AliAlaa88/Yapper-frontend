import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import enMessages from '../i18n/locales/en.json'

// Mock Nuxt auto-imports
;(global as any).defineNuxtComponent = vi.fn((component: any) => component)
;(global as any).defineNuxtPlugin = vi.fn((plugin: any) => plugin)

// Helper function to get nested translation values
function getTranslation(key: string, messages: any): string {
  const keys = key.split('.')
  let value = messages
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return key // Return the key if translation not found
    }
  }
  return typeof value === 'string' ? value : key
}

// Set up global test configuration
config.global.mocks = {
  $t: (key: string) => getTranslation(key, enMessages),
}

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
;(global as any).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// Mock ResizeObserver
;(global as any).ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock scrollTo
;(window as any).scrollTo = vi.fn()

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
;(global as any).localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
;(global as any).sessionStorage = sessionStorageMock
