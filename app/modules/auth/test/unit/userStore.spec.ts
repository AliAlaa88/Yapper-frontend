import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '../../stores/userStore'

// Mock useCookie
const mockCookie = { value: null as string | null }
vi.mock('#app', () => ({
    useNuxtApp: () => ({
        runWithContext: (fn: any) => fn(),
    }),
}))

// Mock import.meta.client
vi.stubGlobal('import', { meta: { client: false } })

// Mock watch from vue
vi.mock('vue', async () => {
    const actual = await vi.importActual('vue')
    return {
        ...actual,
        // Keep watch but don't execute watchers in tests
    }
})

describe('userStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe('initial state', () => {
        it('has null user initially', () => {
            const store = useUserStore()
            expect(store.user).toBeNull()
        })

        it('has null accessToken initially', () => {
            const store = useUserStore()
            expect(store.accessToken).toBeNull()
        })

        it('isLoggedIn is false when no user or token', () => {
            const store = useUserStore()
            expect(store.isLoggedIn).toBe(false)
        })
    })

    describe('getUser', () => {
        it('returns null when no user is set', () => {
            const store = useUserStore()
            expect(store.getUser()).toBeNull()
        })

        it('returns user when user is set', () => {
            const store = useUserStore()
            const mockUser = {
                id: '1',
                username: 'test',
                name: 'Test User',
                email: 'test@test.com',
            } as any
            store.setUser(mockUser)
            expect(store.getUser()).toEqual(mockUser)
        })
    })

    describe('setAccessToken', () => {
        it('sets access token correctly', () => {
            const store = useUserStore()
            store.setAccessToken('test-token-123')
            expect(store.accessToken).toBe('test-token-123')
        })

        it('can set token to null', () => {
            const store = useUserStore()
            store.setAccessToken('test-token')
            store.setAccessToken(null)
            expect(store.accessToken).toBeNull()
        })
    })

    describe('getAccessToken', () => {
        it('returns null when no token is set', () => {
            const store = useUserStore()
            expect(store.getAccessToken()).toBeNull()
        })

        it('returns token when token is set', () => {
            const store = useUserStore()
            store.setAccessToken('my-token')
            expect(store.getAccessToken()).toBe('my-token')
        })
    })

    describe('setAuth', () => {
        it('sets both user and token from auth data', () => {
            const store = useUserStore()
            const authData = {
                access_token: 'auth-token-123',
                user: {
                    id: '1',
                    username: 'testuser',
                    name: 'Test',
                    email: 'test@example.com',
                } as any,
            }
            store.setAuth(authData)
            expect(store.accessToken).toBe('auth-token-123')
            expect(store.user).toEqual(authData.user)
        })

        it('does not set if access_token is missing', () => {
            const store = useUserStore()
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
            store.setAuth({ user: { id: '1' } } as any)
            expect(store.accessToken).toBeNull()
            expect(warnSpy).toHaveBeenCalledWith('[UserStore] setAuth called without access_token')
            warnSpy.mockRestore()
        })
    })

    describe('setUser', () => {
        it('sets user correctly', () => {
            const store = useUserStore()
            const mockUser = {
                id: '2',
                username: 'user2',
                name: 'User Two',
                email: 'user2@test.com',
            } as any
            store.setUser(mockUser)
            expect(store.user).toEqual(mockUser)
        })
    })

    describe('updateUser', () => {
        it('updates user with partial data', () => {
            const store = useUserStore()
            const mockUser = {
                id: '1',
                username: 'original',
                name: 'Original Name',
                email: 'original@test.com',
            } as any
            store.setUser(mockUser)
            store.updateUser({ name: 'Updated Name' })
            expect(store.user?.name).toBe('Updated Name')
            expect(store.user?.username).toBe('original')
        })

        it('does nothing if user is null', () => {
            const store = useUserStore()
            store.updateUser({ name: 'New Name' })
            expect(store.user).toBeNull()
        })
    })

    describe('logout', () => {
        it('clears user and token', () => {
            const store = useUserStore()
            store.setAuth({
                access_token: 'token',
                user: { id: '1', username: 'test', name: 'Test', email: 'test@test.com' } as any,
            })

            // Mock localStorage
            const removeItemSpy = vi
                .spyOn(Storage.prototype, 'removeItem')
                .mockImplementation(() => {})

            store.logout()

            expect(store.user).toBeNull()
            expect(store.accessToken).toBeNull()
            expect(removeItemSpy).toHaveBeenCalledWith('yapper-search-history')

            removeItemSpy.mockRestore()
        })
    })

    describe('isLoggedIn', () => {
        it('returns true when user and token are set', () => {
            const store = useUserStore()
            store.setAuth({
                access_token: 'token',
                user: { id: '1', username: 'test', name: 'Test', email: 'test@test.com' } as any,
            })
            expect(store.isLoggedIn).toBe(true)
        })

        it('returns false when only user is set', () => {
            const store = useUserStore()
            store.setUser({
                id: '1',
                username: 'test',
                name: 'Test',
                email: 'test@test.com',
            } as any)
            expect(store.isLoggedIn).toBe(false)
        })

        it('returns false when only token is set', () => {
            const store = useUserStore()
            store.setAccessToken('token')
            expect(store.isLoggedIn).toBe(false)
        })
    })
})
