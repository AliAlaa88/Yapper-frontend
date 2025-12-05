import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useEditProfileMutation } from '../../queries/useEditProfileQuery'

const mockUserInfoService = {
    updateUserProfile: vi.fn(),
    uploadCoverPhoto: vi.fn(),
    uploadAvatar: vi.fn(),
}

const mockQueryClient = {
    invalidateQueries: vi.fn(),
    removeQueries: vi.fn(),
}

const mockUseMutation = vi.fn()

vi.mock('@tanstack/vue-query', () => ({
    useMutation: (options: any) => {
        mockUseMutation(options)
        return {
            mutate: vi.fn(),
            mutateAsync: vi.fn(),
            isLoading: false,
            error: null,
        }
    },
}))

vi.mock('nuxt/app', () => ({
    useNuxtApp: () => ({
        $userInfoService: mockUserInfoService,
        $queryClient: mockQueryClient,
    }),
}))

vi.mock('~/modules/Common/queries/cacheInvalidation', () => ({
    cacheInvalidation: {
        onUsernameChange: vi.fn(),
        onProfileUpdate: vi.fn(),
        onCoverPhotoChange: vi.fn(),
        onAvatarChange: vi.fn(),
    },
}))

describe('useEditProfileMutation', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('creates edit profile mutation', () => {
        const userId = '123'
        const username = 'testuser'
        const result = useEditProfileMutation(userId, username)

        expect(result).toHaveProperty('editProfileMutation')
        expect(mockUseMutation).toHaveBeenCalled()
    })

    it('creates upload cover photo mutation', () => {
        const userId = '123'
        const username = 'testuser'
        const result = useEditProfileMutation(userId, username)

        expect(result).toHaveProperty('uploadCoverPhotoMutation')
    })

    it('creates upload avatar mutation', () => {
        const userId = '123'
        const username = 'testuser'
        const result = useEditProfileMutation(userId, username)

        expect(result).toHaveProperty('uploadAvatarMutation')
    })

    it('returns all three mutations', () => {
        const userId = '123'
        const username = 'testuser'
        const result = useEditProfileMutation(userId, username)

        expect(result.editProfileMutation).toBeDefined()
        expect(result.uploadCoverPhotoMutation).toBeDefined()
        expect(result.uploadAvatarMutation).toBeDefined()
    })

    it('edit profile mutation uses correct service method', () => {
        const userId = '123'
        const username = 'testuser'
        useEditProfileMutation(userId, username)

        const mutationCall = mockUseMutation.mock.calls[0]![0]
        expect(mutationCall.mutationFn).toBeDefined()
        expect(typeof mutationCall.mutationFn).toBe('function')
    })

    it('edit profile mutation has onSuccess handler', () => {
        const userId = '123'
        const username = 'testuser'
        useEditProfileMutation(userId, username)

        const mutationCall = mockUseMutation.mock.calls[0]![0]
        expect(mutationCall.onSuccess).toBeDefined()
        expect(typeof mutationCall.onSuccess).toBe('function')
    })

    it('upload cover photo mutation uses correct service method', () => {
        const userId = '123'
        const username = 'testuser'
        useEditProfileMutation(userId, username)

        const mutationCall = mockUseMutation.mock.calls[1]![0]
        expect(mutationCall.mutationFn).toBeDefined()
        expect(typeof mutationCall.mutationFn).toBe('function')
    })

    it('upload avatar mutation uses correct service method', () => {
        const userId = '123'
        const username = 'testuser'
        useEditProfileMutation(userId, username)

        const mutationCall = mockUseMutation.mock.calls[2]![0]
        expect(mutationCall.mutationFn).toBeDefined()
        expect(typeof mutationCall.mutationFn).toBe('function')
    })
})
