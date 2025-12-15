import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import {
    useLoginQuery,
    useCheckIdentifierAvailabilityQuery,
    useLogoutQuery,
} from '../../queries/useLoginQuery'

const mockAuthService = {
    login: vi.fn(),
    checkIdentifierAvailability: vi.fn(),
    logout: vi.fn(),
}

const mockQueryClient = {
    invalidateQueries: vi.fn(),
    clear: vi.fn(),
}

vi.mock('#app', () => ({
    useNuxtApp: () => ({
        $authService: mockAuthService,
        $queryClient: mockQueryClient,
        runWithContext: (fn: any) => fn(),
    }),
}))

vi.mock('~/modules/Common/queries/cacheInvalidation', () => ({
    cacheInvalidation: {
        onLogin: vi.fn(),
        onLogout: vi.fn(),
    },
}))

vi.mock('../../stores/userStore', () => ({
    useUserStore: () => ({
        logout: vi.fn(),
    }),
}))

// Mock useMutation
const mockMutate = vi.fn()
const mockMutateAsync = vi.fn()

vi.mock('@tanstack/vue-query', () => ({
    useMutation: (options: any) => {
        return {
            mutate: (data: any) => {
                mockMutate(data)
                return options
                    .mutationFn(data)
                    .then((result: any) => options.onSuccess?.(result))
                    .catch((error: any) => options.onError?.(error))
            },
            mutateAsync: (data: any) => {
                mockMutateAsync(data)
                return options.mutationFn(data)
            },
            isPending: ref(false),
        }
    },
}))

// Mock window.location
const mockLocation = { href: '' }
Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true,
})

describe('useLoginQuery', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockLocation.href = ''
    })

    it('returns mutation object with mutate function', () => {
        const result = useLoginQuery()

        expect(result.mutate).toBeDefined()
        expect(typeof result.mutate).toBe('function')
    })

    it('calls authService.login with correct parameters', async () => {
        mockAuthService.login.mockResolvedValue({ access_token: 'token', user: {} })

        const result = useLoginQuery()
        await result.mutate({ identifier: 'test@test.com', Password: 'password123', Type: 'email' })

        expect(mockAuthService.login).toHaveBeenCalledWith('test@test.com', 'password123', 'email')
    })

    it('has mutateAsync function', () => {
        const result = useLoginQuery()

        expect(result.mutateAsync).toBeDefined()
    })

    it('has isPending state', () => {
        const result = useLoginQuery()

        expect(result.isPending).toBeDefined()
    })
})

describe('useCheckIdentifierAvailabilityQuery', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns mutation object', () => {
        const result = useCheckIdentifierAvailabilityQuery()

        expect(result.mutate).toBeDefined()
    })

    it('calls authService.checkIdentifierAvailability', async () => {
        mockAuthService.checkIdentifierAvailability.mockResolvedValue({ available: true })

        const result = useCheckIdentifierAvailabilityQuery()
        await result.mutate('test@test.com')

        expect(mockAuthService.checkIdentifierAvailability).toHaveBeenCalledWith('test@test.com')
    })

    it('has mutateAsync function', () => {
        const result = useCheckIdentifierAvailabilityQuery()

        expect(result.mutateAsync).toBeDefined()
    })
})

describe('useLogoutQuery', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockLocation.href = ''
    })

    it('returns mutation object', () => {
        const result = useLogoutQuery()

        expect(result.mutate).toBeDefined()
    })

    it('calls authService.logout', async () => {
        mockAuthService.logout.mockResolvedValue({})

        const result = useLogoutQuery()
        await result.mutate()

        expect(mockAuthService.logout).toHaveBeenCalled()
    })

    it('has isPending state', () => {
        const result = useLogoutQuery()

        expect(result.isPending).toBeDefined()
    })
})
