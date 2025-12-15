import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock runtime config
const mockRuntimeConfig = {
    public: {
        mockApi: 'true',
    },
}

vi.mock('#app', () => ({
    useRuntimeConfig: () => mockRuntimeConfig,
}))

// Mock the service modules
vi.mock('../../services/searchService.real', () => ({
    searchServiceReal: {
        getSearchSuggestions: vi.fn(),
        getUsers: vi.fn(),
    },
}))

vi.mock('../../services/searchService.mock', () => ({
    searchServiceMock: {
        getSearchSuggestions: vi.fn(),
        getUsers: vi.fn(),
    },
}))

describe('createSearchService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.resetModules()
    })

    it('returns mock service when mockApi is true', async () => {
        mockRuntimeConfig.public.mockApi = 'true'
        
        const { createSearchService } = await import('../../services/index')
        const service = createSearchService()
        
        expect(service).toBeDefined()
        expect(service.getSearchSuggestions).toBeDefined()
        expect(service.getUsers).toBeDefined()
    })

    it('returns real service when mockApi is false', async () => {
        mockRuntimeConfig.public.mockApi = 'false'
        
        const { createSearchService } = await import('../../services/index')
        const service = createSearchService()
        
        expect(service).toBeDefined()
        expect(service.getSearchSuggestions).toBeDefined()
        expect(service.getUsers).toBeDefined()
    })

    it('service has getSearchSuggestions method', async () => {
        const { createSearchService } = await import('../../services/index')
        const service = createSearchService()
        
        expect(typeof service.getSearchSuggestions).toBe('function')
    })

    it('service has getUsers method', async () => {
        const { createSearchService } = await import('../../services/index')
        const service = createSearchService()
        
        expect(typeof service.getUsers).toBe('function')
    })
})
