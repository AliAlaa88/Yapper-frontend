import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockAuthService = {
    updateProfilePicture: vi.fn(),
    updateUsername: vi.fn(),
    updateLanguage: vi.fn(),
    getInterests: vi.fn(),
    updateInterests: vi.fn(),
    updateProfile: vi.fn(),
}

const mockQueryClient = {
    invalidateQueries: vi.fn(),
}

vi.mock('nuxt/app', () => ({
    useNuxtApp: vi.fn(() => ({
        $authService: mockAuthService,
        $queryClient: mockQueryClient,
    })),
}))

vi.mock('@tanstack/vue-query', () => ({
    useMutation: vi.fn((options: any) => ({
        ...options,
        mutate: vi.fn(),
        mutateAsync: vi.fn(),
        isPending: { value: false },
        isError: { value: false },
        isSuccess: { value: false },
    })),
}))

vi.mock('~/modules/Common/queries/cacheInvalidation', () => ({
    cacheInvalidation: {
        onUsernameChange: vi.fn(),
    },
}))

const {
    useUpdateProfilePictureMutation,
    useUpdateUsernameMutation,
    useUpdateLanguageMutation,
    useFetchInterests,
    useUpdateInterestsMutation,
    useUpdateProfileMutation,
} = await import('../../queries/useCompleteProfileQuery')

describe('useCompleteProfileQuery mutations', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('useUpdateProfilePictureMutation', () => {
        it('should create mutation with correct mutationKey', () => {
            const result = useUpdateProfilePictureMutation()

            expect(result.mutationKey).toEqual(['updateProfilePicture'])
        })

        it('should have retry set to false', () => {
            const result = useUpdateProfilePictureMutation()

            expect(result.retry).toBe(false)
        })

        it('should have mutationFn defined', () => {
            const result = useUpdateProfilePictureMutation()

            expect(result.mutationFn).toBeDefined()
            expect(typeof result.mutationFn).toBe('function')
        })

        it('should call onError callback when provided', () => {
            const onError = vi.fn()
            const result = useUpdateProfilePictureMutation(undefined, onError)

            const error = new Error('Upload failed')
            result.onError(error)

            expect(onError).toHaveBeenCalledWith(error)
        })

        it('should have onSuccess defined', () => {
            const onSuccess = vi.fn()
            const result = useUpdateProfilePictureMutation(onSuccess)

            expect(result.onSuccess).toBeDefined()
        })
    })

    describe('useUpdateUsernameMutation', () => {
        it('should create mutation with correct mutationKey', () => {
            const result = useUpdateUsernameMutation()

            expect(result.mutationKey).toEqual(['updateUsername'])
        })

        it('should have retry set to false', () => {
            const result = useUpdateUsernameMutation()

            expect(result.retry).toBe(false)
        })

        it('should have mutationFn defined', () => {
            const result = useUpdateUsernameMutation()

            expect(result.mutationFn).toBeDefined()
        })

        it('should call onSuccess callback', () => {
            const onSuccess = vi.fn()
            const result = useUpdateUsernameMutation(undefined, onSuccess)

            result.onSuccess({ username: 'newuser' })

            expect(onSuccess).toHaveBeenCalledWith({ username: 'newuser' })
        })
    })

    describe('useUpdateLanguageMutation', () => {
        it('should create mutation with correct mutationKey', () => {
            const result = useUpdateLanguageMutation()

            expect(result.mutationKey).toEqual(['updateLanguage'])
        })

        it('should have retry set to false', () => {
            const result = useUpdateLanguageMutation()

            expect(result.retry).toBe(false)
        })

        it('should have mutationFn defined', () => {
            const result = useUpdateLanguageMutation()

            expect(result.mutationFn).toBeDefined()
        })

        it('should call onSuccess callback', () => {
            const onSuccess = vi.fn()
            const result = useUpdateLanguageMutation(onSuccess)

            result.onSuccess({ language: 'ar' })

            expect(onSuccess).toHaveBeenCalledWith({ language: 'ar' })
        })
    })

    describe('useFetchInterests', () => {
        it('should create mutation with correct mutationKey', () => {
            const result = useFetchInterests()

            expect(result.mutationKey).toEqual(['getInterests'])
        })

        it('should have retry set to false', () => {
            const result = useFetchInterests()

            expect(result.retry).toBe(false)
        })

        it('should have mutationFn defined', () => {
            const result = useFetchInterests()

            expect(result.mutationFn).toBeDefined()
        })

        it('should call onSuccess with data', () => {
            const onSuccess = vi.fn()
            const result = useFetchInterests(onSuccess)

            const mockInterests = [{ id: 1, name: 'Technology' }]
            result.onSuccess(mockInterests)

            expect(onSuccess).toHaveBeenCalledWith(mockInterests)
        })
    })

    describe('useUpdateInterestsMutation', () => {
        it('should create mutation with correct mutationKey', () => {
            const result = useUpdateInterestsMutation()

            expect(result.mutationKey).toEqual(['updateInterests'])
        })

        it('should have retry set to false', () => {
            const result = useUpdateInterestsMutation()

            expect(result.retry).toBe(false)
        })

        it('should have mutationFn defined', () => {
            const result = useUpdateInterestsMutation()

            expect(result.mutationFn).toBeDefined()
        })

        it('should call onSuccess callback', () => {
            const onSuccess = vi.fn()
            const result = useUpdateInterestsMutation(onSuccess)

            result.onSuccess({ interests: [1, 2, 3] })

            expect(onSuccess).toHaveBeenCalledWith({ interests: [1, 2, 3] })
        })
    })

    describe('useUpdateProfileMutation', () => {
        it('should create mutation with correct mutationKey', () => {
            const result = useUpdateProfileMutation()

            expect(result.mutationKey).toEqual(['updateProfile'])
        })

        it('should have retry set to false', () => {
            const result = useUpdateProfileMutation()

            expect(result.retry).toBe(false)
        })

        it('should have mutationFn defined', () => {
            const result = useUpdateProfileMutation()

            expect(result.mutationFn).toBeDefined()
        })

        it('should call onSuccess callback', () => {
            const onSuccess = vi.fn()
            const result = useUpdateProfileMutation(onSuccess)

            result.onSuccess({ avatar_url: 'new-avatar.jpg' })

            expect(onSuccess).toHaveBeenCalledWith({ avatar_url: 'new-avatar.jpg' })
        })

        it('should call onError callback', () => {
            const onError = vi.fn()
            const result = useUpdateProfileMutation(undefined, onError)

            const error = new Error('Update failed')
            result.onError(error)

            expect(onError).toHaveBeenCalledWith(error)
        })
    })
})
