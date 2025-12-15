// import { describe, it, expect, vi, beforeEach } from 'vitest'
// import { ref, nextTick } from 'vue'
// import { usePasswordProtection } from '~/modules/settings/composables/usePasswordProtection'

// /* ----------------------------------
//  * SHARED STORE INSTANCE (IMPORTANT)
//  * ---------------------------------- */
// const isSessionValid = ref(false)

// const checkSessionMock = vi.fn()
// const confirmPasswordMock = vi.fn()
// const requireReconfirmationMock = vi.fn()

// vi.mock('~/modules/settings/stores/usePasswordConfirmationStore', () => ({
//     usePasswordConfirmationStore: () => ({
//         checkSession: checkSessionMock,
//         confirmPassword: confirmPasswordMock,
//         requireReconfirmation: requireReconfirmationMock,
//         isSessionValid,
//     }),
// }))

// const mutateAsyncMock = vi.fn()

// vi.mock('~/modules/settings/queries/userSettingsQueries', () => ({
//     userSettingsQueries: () => ({
//         useConfirmPassword: {
//             mutateAsync: mutateAsyncMock,
//             isPending: ref(false),
//         },
//     }),
// }))

// function setupComposable() {
//     return usePasswordProtection()
// }

// describe('usePasswordProtection', () => {
//     beforeEach(() => {
//         vi.clearAllMocks()
//         isSessionValid.value = false
//     })

//     it('initial state reflects immediate watcher', () => {
//         const composable = setupComposable()

//         // Access without .value since they're already the raw values
//         expect(composable.isProtectedContentVisible).toBe(false)
//         expect(composable.showPasswordConfirmation).toBe(true)
//         expect(composable.isConfirmingPassword).toBe(false)
//     })

//     it('checkPasswordConfirmation returns true when session is valid', () => {
//         checkSessionMock.mockReturnValue(true)

//         const composable = setupComposable()
//         const result = composable.checkPasswordConfirmation()

//         expect(result).toBe(true)
//         expect(composable.isProtectedContentVisible).toBe(true)
//         expect(composable.showPasswordConfirmation).toBe(false)
//     })

//     it('checkPasswordConfirmation returns false when session is invalid', () => {
//         checkSessionMock.mockReturnValue(false)

//         const composable = setupComposable()
//         const result = composable.checkPasswordConfirmation()

//         expect(result).toBe(false)
//         expect(composable.isProtectedContentVisible).toBe(false)
//         expect(composable.showPasswordConfirmation).toBe(true)
//     })

//     it('handlePasswordConfirmation succeeds', async () => {
//         mutateAsyncMock.mockResolvedValue(undefined)
//         confirmPasswordMock.mockImplementation(() => {
//             isSessionValid.value = true
//         })

//         const composable = setupComposable()
//         const result = await composable.handlePasswordConfirmation('password123')

//         await nextTick()

//         expect(mutateAsyncMock).toHaveBeenCalledWith({ password: 'password123' })
//         expect(confirmPasswordMock).toHaveBeenCalled()
//         expect(composable.isProtectedContentVisible).toBe(true)
//         expect(composable.showPasswordConfirmation).toBe(false)
//         expect(result).toBe(true)
//     })

//     it('handlePasswordConfirmation throws on error', async () => {
//         mutateAsyncMock.mockRejectedValue(new Error('Invalid password'))

//         const composable = setupComposable()

//         await expect(composable.handlePasswordConfirmation('wrong')).rejects.toThrow(
//             'Invalid password',
//         )
//     })

//     it('invalidateOnPasswordChange resets state', async () => {
//         const composable = setupComposable()

//         requireReconfirmationMock.mockImplementation(() => {
//             isSessionValid.value = false
//         })

//         composable.invalidateOnPasswordChange()
//         await nextTick()

//         expect(requireReconfirmationMock).toHaveBeenCalled()
//         expect(composable.isProtectedContentVisible).toBe(false)
//     })

//     it('watcher reacts when session becomes invalid', async () => {
//         const composable = setupComposable()

//         isSessionValid.value = false
//         await nextTick()

//         expect(composable.isProtectedContentVisible).toBe(false)
//         expect(composable.showPasswordConfirmation).toBe(true)
//     })

//     it('watcher reacts when session becomes valid', async () => {
//         const composable = setupComposable()

//         isSessionValid.value = true
//         await nextTick()

//         expect(composable.isProtectedContentVisible).toBe(true)
//         expect(composable.showPasswordConfirmation).toBe(false)
//     })
// })
