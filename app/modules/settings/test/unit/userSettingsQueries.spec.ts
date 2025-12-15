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

vi.mock('nuxt/app', () => ({
    useNuxtApp: () => ({
        $settingsService: mockSettingsService,
        $queryClient: mockQueryClient,
    }),
}))

vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        locale: { value: 'en' },
    }),
}))

vi.mock('~/modules/auth/stores/userStore', () => ({
    useUserStore: () => mockUserStore,
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
    })

    it('should initialize infinite queries with correct configuration', () => {
        userSettingsQueries()

        expect(useInfiniteQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ['muted-users'],
                initialPageParam: undefined,
            }),
        )

        expect(useInfiniteQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ['blocked-users'],
                initialPageParam: undefined,
            }),
        )
    })

    it('should handle muted users pagination with getNextPageParam', async () => {
        userSettingsQueries()

        const call = (useInfiniteQuery as any).mock.calls[0][0]
        const getNextPageParam = call.getNextPageParam

        const resultWithMore = {
            data: { pagination: { has_more: true, next_cursor: 'cursor123' } },
        }
        expect(getNextPageParam(resultWithMore)).toBe('cursor123')

        const resultNoMore = { data: { pagination: { has_more: false } } }
        expect(getNextPageParam(resultNoMore)).toBeUndefined()
    })

    it('should initialize all mutations with correct configuration', () => {
        userSettingsQueries()

        const mutationCalls = (useMutation as any).mock.calls

        const mutationFns = mutationCalls.map((call: any[]) => call[0].mutationFn?.toString?.())
        expect(mutationFns.length).toBeGreaterThanOrEqual(5)
    })

    it('should initialize useQuery for username recommendations', () => {
        userSettingsQueries()

        expect(useQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ['username-recommendation'],
            }),
        )
    })

    it('should execute changeLanguage mutation with proper callbacks', () => {
        userSettingsQueries()


        const languageMutationCall = (useMutation as any).mock.calls.find(
            (call: any[]) => call[0].mutationFn?.length === 1,
        )

        expect(languageMutationCall).toBeDefined()
        expect(languageMutationCall[0].onSuccess).toBeDefined()
        expect(languageMutationCall[0].onError).toBeDefined()
    })

    it('should execute deleteAccount mutation with onSuccess callback', () => {
        userSettingsQueries()

        const deleteAccountCall = (useMutation as any).mock.calls.find(
            (call: any[]) => call[0].mutationFn?.length === 0,
        )

        expect(deleteAccountCall).toBeDefined()
        expect(deleteAccountCall[0].onSuccess).toBeDefined()
        expect(deleteAccountCall[0].onError).toBeDefined()
    })
})
