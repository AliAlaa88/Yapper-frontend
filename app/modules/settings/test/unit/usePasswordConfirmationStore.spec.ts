import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePasswordConfirmationStore } from '~/modules/settings/stores/usePasswordConfirmationStore'

describe('usePasswordConfirmationStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('should initialize with default state', () => {
        const store = usePasswordConfirmationStore()

        expect(store.isConfirmed).toBe(false)
        expect(store.confirmedAt).toBeNull()
        expect(store.sessionDuration).toBe(30 * 60 * 1000)
    })

    it('should confirm password and set confirmation timestamp', () => {
        const store = usePasswordConfirmationStore()
        const now = 1000000000
        vi.spyOn(global.Date, 'now').mockReturnValue(now)

        store.confirmPassword()

        expect(store.isConfirmed).toBe(true)
        expect(store.confirmedAt).toBe(now)
    })

    it('should invalidate and require reconfirmation', () => {
        const store = usePasswordConfirmationStore()

        vi.spyOn(global.Date, 'now').mockReturnValue(1000000000)
        store.confirmPassword()
        expect(store.isConfirmed).toBe(true)
        expect(store.isSessionValid).toBe(true)

        store.requireReconfirmation()

        expect(store.isConfirmed).toBe(false)
        expect(store.confirmedAt).toBeNull()
        expect(store.isSessionValid).toBe(false)
    })

    it('should return true from checkSession when session is still valid', () => {
        const store = usePasswordConfirmationStore()
        const startTime = 1000000000

        vi.spyOn(global.Date, 'now').mockReturnValue(startTime)
        store.confirmPassword()

        vi.spyOn(global.Date, 'now').mockReturnValue(startTime + 10 * 60 * 1000)

        const result = store.checkSession()

        expect(result).toBe(true)
        expect(store.isConfirmed).toBe(true)
        expect(store.confirmedAt).toBe(startTime)
    })
})
