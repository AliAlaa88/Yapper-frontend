import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useEditProfileMutation } from '../../queries/useEditProfileQuery'

// Use vi.hoisted to create mock functions that are accessible in hoisted vi.mock calls
const { 
    mockUserInfoService, 
    mockQueryClient, 
    mockUseMutation,
    mockOnUsernameChange,
    mockOnProfileUpdate,
    mockOnCoverPhotoChange,
    mockOnAvatarChange 
} = vi.hoisted(() => ({
    mockUserInfoService: {
        updateUserProfile: vi.fn(),
        uploadCoverPhoto: vi.fn(),
        uploadAvatar: vi.fn(),
    },
    mockQueryClient: {
        invalidateQueries: vi.fn(),
        removeQueries: vi.fn(),
    },
    mockUseMutation: vi.fn(),
    mockOnUsernameChange: vi.fn(),
    mockOnProfileUpdate: vi.fn(),
    mockOnCoverPhotoChange: vi.fn(),
    mockOnAvatarChange: vi.fn(),
}))

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
        onUsernameChange: mockOnUsernameChange,
        onProfileUpdate: mockOnProfileUpdate,
        onCoverPhotoChange: mockOnCoverPhotoChange,
        onAvatarChange: mockOnAvatarChange,
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

    it('edit profile onSuccess calls cache invalidation for username change', () => {
        const userId = '123'
        const username = 'testuser'
        useEditProfileMutation(userId, username)

        const mutationCall = mockUseMutation.mock.calls[0]![0]
        // Simulate onSuccess with username change
        mutationCall.onSuccess({ success: true }, { username: 'newusername' })

        expect(mockOnUsernameChange).toHaveBeenCalledWith(mockQueryClient, username)
    })

    it('edit profile onSuccess calls cache invalidation for profile update without username change', () => {
        const userId = '123'
        const username = 'testuser'
        useEditProfileMutation(userId, username)

        const mutationCall = mockUseMutation.mock.calls[0]![0]
        // Simulate onSuccess without username change
        mutationCall.onSuccess({ success: true }, { bio: 'new bio' })

        expect(mockOnProfileUpdate).toHaveBeenCalledWith(mockQueryClient, username)
    })

    it('edit profile onSuccess calls profile update when username unchanged', () => {
        const userId = '123'
        const username = 'testuser'
        useEditProfileMutation(userId, username)

        const mutationCall = mockUseMutation.mock.calls[0]![0]
        // Simulate onSuccess with same username
        mutationCall.onSuccess({ success: true }, { username: 'testuser' })

        expect(mockOnProfileUpdate).toHaveBeenCalledWith(mockQueryClient, username)
    })

    it('upload cover photo onSuccess calls cache invalidation', () => {
        const userId = '123'
        const username = 'testuser'
        useEditProfileMutation(userId, username)

        const mutationCall = mockUseMutation.mock.calls[1]![0]
        mutationCall.onSuccess()

        expect(mockOnCoverPhotoChange).toHaveBeenCalledWith(mockQueryClient, username)
    })

    it('upload avatar onSuccess calls cache invalidation', () => {
        const userId = '123'
        const username = 'testuser'
        useEditProfileMutation(userId, username)

        const mutationCall = mockUseMutation.mock.calls[2]![0]
        mutationCall.onSuccess()

        expect(mockOnAvatarChange).toHaveBeenCalledWith(mockQueryClient, username)
    })

    it('edit profile mutation calls service with correct parameters', async () => {
        const userId = '123'
        const username = 'testuser'
        useEditProfileMutation(userId, username)

        const mutationCall = mockUseMutation.mock.calls[0]![0]
        const updates = { name: 'New Name', bio: 'New Bio' }
        await mutationCall.mutationFn(updates)

        expect(mockUserInfoService.updateUserProfile).toHaveBeenCalledWith(userId, updates)
    })

    it('upload cover photo mutation calls service with correct file', async () => {
        const userId = '123'
        const username = 'testuser'
        useEditProfileMutation(userId, username)

        const mutationCall = mockUseMutation.mock.calls[1]![0]
        const file = new File(['test'], 'cover.jpg', { type: 'image/jpeg' })
        await mutationCall.mutationFn(file)

        expect(mockUserInfoService.uploadCoverPhoto).toHaveBeenCalledWith(userId, file)
    })

    it('upload avatar mutation calls service with correct file', async () => {
        const userId = '123'
        const username = 'testuser'
        useEditProfileMutation(userId, username)

        const mutationCall = mockUseMutation.mock.calls[2]![0]
        const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })
        await mutationCall.mutationFn(file)

        expect(mockUserInfoService.uploadAvatar).toHaveBeenCalledWith(userId, file)
    })
})
