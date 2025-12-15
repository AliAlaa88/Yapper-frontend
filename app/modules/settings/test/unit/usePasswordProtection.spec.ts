import { describe, it, vi, beforeEach, expect } from 'vitest'
import { usePasswordProtection } from '~/modules/settings/composables/usePasswordProtection'
import { usePasswordConfirmationStore } from '~/modules/settings/stores/usePasswordConfirmationStore'
import { userSettingsQueries } from '~/modules/settings/queries/userSettingsQueries'

vi.mock('~/modules/settings/stores/usePasswordConfirmationStore')
vi.mock('~/modules/settings/queries/userSettingsQueries')

describe('usePasswordProtection', () => {
    let mockStore: any
    let mockMutation: any

    beforeEach(() => {
        vi.clearAllMocks()

        mockMutation = {
            mutateAsync: vi.fn(),
            isPending: ref(false),
        }

        let sessionValid = true
        mockStore = {
            checkSession: vi.fn(),
            confirmPassword: vi.fn(),
            requireReconfirmation: vi.fn(),
            get isSessionValid() {
                return sessionValid
            },
            set isSessionValid(value: boolean) {
                sessionValid = value
            },
        }

        vi.mocked(usePasswordConfirmationStore).mockReturnValue(mockStore)
        vi.mocked(userSettingsQueries).mockReturnValue({
            useConfirmPassword: mockMutation,
        } as any)
    })

    it('should check password confirmation with valid session and return true', () => {
        mockStore.checkSession.mockReturnValue(true)
        const { checkPasswordConfirmation, isProtectedContentVisible, showPasswordConfirmation } =
            usePasswordProtection()

        const result = checkPasswordConfirmation()

        expect(mockStore.checkSession).toHaveBeenCalled()
        expect(result).toBe(true)
        expect(isProtectedContentVisible.value).toBe(true)
        expect(showPasswordConfirmation.value).toBe(false)
    })

    it('should check password confirmation with invalid session, show confirmation dialog, and return false', () => {
        mockStore.isSessionValid = false
        mockStore.checkSession.mockReturnValue(false)
        
        const { checkPasswordConfirmation, isProtectedContentVisible, showPasswordConfirmation } =
            usePasswordProtection()

        const result = checkPasswordConfirmation()

        expect(mockStore.checkSession).toHaveBeenCalled()
        expect(result).toBe(false)
        expect(isProtectedContentVisible.value).toBe(false)
        expect(showPasswordConfirmation.value).toBe(true)
    })

    it('should handle password confirmation success and error scenarios', async () => {
        mockStore.isSessionValid = false
        mockStore.checkSession.mockReturnValue(false)

        mockStore.confirmPassword.mockImplementation(() => {
            mockStore.isSessionValid = true
            mockStore.checkSession.mockReturnValue(true)
        })

        mockMutation.mutateAsync.mockResolvedValue({})

        const {
            handlePasswordConfirmation,
            isProtectedContentVisible,
            showPasswordConfirmation,
        } = usePasswordProtection()

        expect(isProtectedContentVisible.value).toBe(false)

        const result = await handlePasswordConfirmation('correct-password')

        expect(result).toBe(true)
        expect(mockMutation.mutateAsync).toHaveBeenCalledWith({ password: 'correct-password' })
        expect(mockStore.confirmPassword).toHaveBeenCalled()
        expect(isProtectedContentVisible.value).toBe(true)
        expect(showPasswordConfirmation.value).toBe(false)

        const error = new Error('Invalid password')
        mockMutation.mutateAsync.mockRejectedValue(error)

        await expect(handlePasswordConfirmation('wrong-password')).rejects.toThrow('Invalid password')
        expect(mockMutation.mutateAsync).toHaveBeenCalledWith({ password: 'wrong-password' })
    })

    it('should invalidate session and hide protected content on password change', () => {
        const { invalidateOnPasswordChange, isProtectedContentVisible } = usePasswordProtection()

        isProtectedContentVisible.value = true
        invalidateOnPasswordChange()

        expect(mockStore.requireReconfirmation).toHaveBeenCalled()
        expect(isProtectedContentVisible.value).toBe(false)
    })
})
