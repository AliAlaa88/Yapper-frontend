import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import {
    checkIdentifier,
    useRegisterS1Query,
    useRegisterS2Query,
    useRegisterS3Query,
} from '../../queries/useRegisterQuery'

const mockAuthService = {
    checkIdentifierAvailability: vi.fn(),
    registerStep1: vi.fn(),
    registerStep2: vi.fn(),
    registerStep3: vi.fn(),
    resendOTP: vi.fn(),
}

vi.mock('nuxt/app', () => ({
    useNuxtApp: () => ({
        $authService: mockAuthService,
        runWithContext: (fn: any) => fn(),
    }),
}))

// Mock useMutation
vi.mock('@tanstack/vue-query', () => ({
    useMutation: (options: any) => {
        return {
            mutate: (data: any) => {
                return options
                    .mutationFn(data)
                    .then((result: any) => options.onSuccess?.(result))
                    .catch((error: any) => options.onError?.(error))
            },
            mutateAsync: (data: any) => options.mutationFn(data),
            isPending: ref(false),
        }
    },
}))

describe('checkIdentifier', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns mutation object with mutate function', () => {
        const result = checkIdentifier()

        expect(result.mutate).toBeDefined()
        expect(typeof result.mutate).toBe('function')
    })

    it('calls checkIdentifierAvailability with identifier', async () => {
        mockAuthService.checkIdentifierAvailability.mockResolvedValue({ available: true })

        const result = checkIdentifier()
        await result.mutate('test@example.com')

        expect(mockAuthService.checkIdentifierAvailability).toHaveBeenCalledWith('test@example.com')
    })

    it('has mutateAsync function', () => {
        const result = checkIdentifier()

        expect(result.mutateAsync).toBeDefined()
    })
})

describe('useRegisterS1Query', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns mutation object', () => {
        const result = useRegisterS1Query()

        expect(result.mutate).toBeDefined()
    })

    it('calls registerStep1 with payload', async () => {
        mockAuthService.registerStep1.mockResolvedValue({ success: true })
        const payload = { name: 'Test', email: 'test@test.com', dateOfBirth: '2000-01-01' }

        const result = useRegisterS1Query()
        await result.mutate(payload as any)

        expect(mockAuthService.registerStep1).toHaveBeenCalledWith(payload)
    })

    it('has mutateAsync function', () => {
        const result = useRegisterS1Query()

        expect(result.mutateAsync).toBeDefined()
    })
})

describe('useRegisterS2Query', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns mutation object', () => {
        const result = useRegisterS2Query()

        expect(result.mutate).toBeDefined()
    })

    it('calls registerStep2 with payload', async () => {
        mockAuthService.registerStep2.mockResolvedValue({ verified: true })
        const payload = { email: 'test@test.com', otp: '123456' }

        const result = useRegisterS2Query()
        await result.mutate(payload as any)

        expect(mockAuthService.registerStep2).toHaveBeenCalledWith(payload)
    })
})

describe('useRegisterS3Query', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns mutation object', () => {
        const result = useRegisterS3Query()

        expect(result.mutate).toBeDefined()
    })

    it('calls registerStep3 with payload', async () => {
        mockAuthService.registerStep3.mockResolvedValue({ success: true })
        const payload = { email: 'test@test.com', password: 'password123' }

        const result = useRegisterS3Query()
        await result.mutate(payload as any)

        expect(mockAuthService.registerStep3).toHaveBeenCalledWith(payload)
    })
})
