import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/vue-query'
import { userSettingsQueries } from '~/modules/settings/queries/userSettingsQueries'

const mockSettingsService = {
    getMuted: vi.fn(),
    getBlocked: vi.fn(),
    changeLanguage: vi.fn(),
    changePassword: vi.fn(),
    confirmPassword: vi.fn(),
    deleteAccount: vi.fn(),
    updateUsername: vi.fn(),
    getUsernameRecommendations: vi.fn(),
    sendEmailOTP: vi.fn(),
    verifyEmailOTP: vi.fn(),
}

const mockQueryClient = {
    invalidateQueries: vi.fn(),
}

const mockUserStore = {
    user: { username: 'testuser' },
    updateUser: vi.fn(),
}

const mockLocale = { value: 'en' }

vi.mock('nuxt/app', () => ({
    useNuxtApp: () => ({
        $settingsService: mockSettingsService,
        $queryClient: mockQueryClient,
    }),
}))

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        locale: mockLocale,
    }),
}))

vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: () => mockUserStore,
}))

vi.mock('~/modules/Common/queries/cacheInvalidation', () => ({
    cacheInvalidation: {
        onUsernameChange: vi.fn(),
    },
}))

vi.mock('@tanstack/vue-query', async () => {
    const actual = await vi.importActual('@tanstack/vue-query')
    return {
        ...actual,
        useInfiniteQuery: vi.fn(),
        useMutation: vi.fn(),
        useQuery: vi.fn(),
    }
})

describe('userSettingsQueries', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockLocale.value = 'en'
        mockUserStore.user = { username: 'testuser' }
    })

    it('should initialize infinite queries with correct configuration and test getNextPageParam', () => {
        userSettingsQueries()

        expect(useInfiniteQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ['muted-users'],
                initialPageParam: undefined,
            })
        )

        expect(useInfiniteQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ['blocked-users'],
                initialPageParam: undefined,
            })
        )

        const mutedCall = (useInfiniteQuery as any).mock.calls[0][0]
        expect(mutedCall.getNextPageParam({ data: { pagination: { has_more: true, next_cursor: 'abc' } } })).toBe('abc')
        expect(mutedCall.getNextPageParam({ data: { pagination: { has_more: false } } })).toBeUndefined()

        const blockedCall = (useInfiniteQuery as any).mock.calls[1][0]
        expect(blockedCall.getNextPageParam({ data: { pagination: { has_more: true, next_cursor: 'xyz' } } })).toBe('xyz')
        expect(blockedCall.getNextPageParam({ data: { pagination: { has_more: false } } })).toBeUndefined()
    })

    it('should initialize changeLanguage and changePassword mutations with callbacks', () => {
        userSettingsQueries()

        const mutationCalls = (useMutation as any).mock.calls
        const languageCall = mutationCalls.find((call: any[]) => 
            call[0].onSuccess?.toString?.().includes('locale') && 
            call[0].onSuccess?.toString?.().includes('invalidateQueries')
        )
        expect(languageCall).toBeDefined()
        expect(languageCall[0].onSuccess).toBeDefined()
        expect(languageCall[0].onError).toBeDefined()

        languageCall[0].onSuccess({ message: 'changed' }, { language: 'ar' })
        expect(mockLocale.value).toBe('ar')
        expect(languageCall[0].onSuccess.toString()).toContain('invalidateQueries')

        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
        languageCall[0].onError(new Error('Failed'))
        expect(consoleError).toHaveBeenCalled()
        consoleError.mockRestore()

        const passwordCall = mutationCalls.find((call: any[]) => 
            call[0].onSuccess?.toString?.().includes('Password changed successfully')
        )
        expect(passwordCall).toBeDefined()
        const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
        passwordCall[0].onSuccess({ message: 'changed' })
        expect(consoleLog).toHaveBeenCalled()
        consoleLog.mockRestore()
    })

    it('should initialize updateUsername mutation with proper onSuccess and onError handling', () => {
        userSettingsQueries()

        const mutationCalls = (useMutation as any).mock.calls
        const usernameCall = mutationCalls.find((call: any[]) => 
            call[0].onSuccess?.toString?.().includes('updateUser')
        )
        expect(usernameCall).toBeDefined()

        const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
        usernameCall[0].onSuccess({ data: { username: 'newname' } })
        expect(mockUserStore.updateUser).toHaveBeenCalledWith({ username: 'newname' })
        expect(usernameCall[0].onSuccess.toString()).toContain('onUsernameChange')
        consoleLog.mockRestore()

        mockUserStore.user = null as any
        vi.clearAllMocks()
        usernameCall[0].onSuccess({ data: { username: 'another' } })
        expect(mockUserStore.updateUser).toHaveBeenCalledWith({ username: 'another' })

        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
        usernameCall[0].onError(new Error('Username is already taken'))
        expect(consoleError).not.toHaveBeenCalled()

        usernameCall[0].onError(new Error('Invalid username format'))
        expect(consoleError).not.toHaveBeenCalled()

        usernameCall[0].onError(new Error('Network error'))
        expect(consoleError).toHaveBeenCalled()
        consoleError.mockRestore()
    })

    it('should initialize sendEmailOTP mutation with onSuccess and onError handlers', () => {
        userSettingsQueries()

        const mutationCalls = (useMutation as any).mock.calls
        const emailCall = mutationCalls.find((call: any[]) => 
            call[0].onSuccess?.toString?.().includes('Email OTP sent successfully')
        )
        expect(emailCall).toBeDefined()

        const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
        emailCall[0].onSuccess({ message: 'OTP sent' })
        expect(consoleLog).toHaveBeenCalled()

        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
        emailCall[0].onError(new Error('Failed to send'))
        expect(consoleError).toHaveBeenCalled()
        consoleError.mockRestore()
        consoleLog.mockRestore()
    })

    it('should initialize confirmPassword and deleteAccount mutations', () => {
        userSettingsQueries()

        const mutationCalls = (useMutation as any).mock.calls

        const confirmCall = mutationCalls.find((call: any[]) => 
            call[0].onSuccess?.toString?.().includes('Password confirmed')
        )
        expect(confirmCall).toBeDefined()
        const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
        confirmCall[0].onSuccess({ confirmed: true })
        expect(consoleLog).toHaveBeenCalled()
        consoleLog.mockRestore()

        const deleteCall = mutationCalls.find((call: any[]) => 
            call[0].onSuccess?.toString?.().includes('Account deleted successfully')
        )
        expect(deleteCall).toBeDefined()
        expect(deleteCall[0].onError).toBeDefined()

        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
        deleteCall[0].onError(new Error('Failed'))
        expect(consoleError).toHaveBeenCalled()
        consoleError.mockRestore()
    })

    it('should initialize verifyEmailOTP mutation and username recommendation query', () => {
        userSettingsQueries()

        const mutationCalls = (useMutation as any).mock.calls

        const verifyCall = mutationCalls.find((call: any[]) => 
            !call[0].onSuccess && !call[0].onError
        )
        expect(verifyCall).toBeDefined()
        expect(useQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ['username-recommendation'],
            })
        )
    })
})
