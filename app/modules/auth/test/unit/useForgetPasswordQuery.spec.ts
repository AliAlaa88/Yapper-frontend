import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockAuthService = {
    forgotPassword: vi.fn(),
    verifyForgotPasswordOTP: vi.fn(),
    resetPassword: vi.fn(),
}

const mockUseMutation = vi.fn()

vi.mock('#app', () => ({
    useNuxtApp: () => ({
        $authService: mockAuthService,
    }),
}))

vi.mock('@tanstack/vue-query', () => ({
    useMutation: (options: any) => mockUseMutation(options),
}))

const { useForgotPasswordQuery, useVerifyForgotPasswordOTPQuery, useResetPasswordQuery } = await import('../../queries/useForgetPasswordQuery')

describe('useForgetPasswordQuery', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should create mutation with correct mutationKey', () => {
        useForgotPasswordQuery()

        const callArgs = mockUseMutation.mock.calls[0][0]
        expect(callArgs.mutationKey).toEqual(['forgotPassword'])
    })

    it('should call forgotPassword with identifier', async () => {
        const onSuccess = vi.fn()
        useForgotPasswordQuery(onSuccess)

        const callArgs = mockUseMutation.mock.calls[0][0]
        mockAuthService.forgotPassword.mockResolvedValue({ success: true })

        await callArgs.mutationFn({ identifier: 'test@example.com' })

        expect(mockAuthService.forgotPassword).toHaveBeenCalledWith('test@example.com')
    })

    it('should call onSuccess callback when mutation succeeds', async () => {
        const onSuccess = vi.fn()
        useForgotPasswordQuery(onSuccess)

        const callArgs = mockUseMutation.mock.calls[0][0]
        const responseData = { resetToken: 'token123' }
        
        callArgs.onSuccess(responseData)

        expect(onSuccess).toHaveBeenCalledWith(responseData)
    })

    it('should call onError callback when mutation fails', async () => {
        const onError = vi.fn()
        useForgotPasswordQuery(undefined, onError)

        const callArgs = mockUseMutation.mock.calls[0][0]
        const error = new Error('User not found')
        
        callArgs.onError(error)

        expect(onError).toHaveBeenCalledWith(error)
    })

    it('should have retry set to false', () => {
        useForgotPasswordQuery()

        const callArgs = mockUseMutation.mock.calls[0][0]
        expect(callArgs.retry).toBe(false)
    })
})

describe('useVerifyForgotPasswordOTPQuery', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should create mutation with correct mutationKey', () => {
        useVerifyForgotPasswordOTPQuery()

        const callArgs = mockUseMutation.mock.calls[0][0]
        expect(callArgs.mutationKey).toEqual(['verifyForgotPasswordOTP'])
    })

    it('should call verifyForgotPasswordOTP with identifier and token', async () => {
        useVerifyForgotPasswordOTPQuery()

        const callArgs = mockUseMutation.mock.calls[0][0]
        mockAuthService.verifyForgotPasswordOTP.mockResolvedValue({ verified: true })

        await callArgs.mutationFn({ identifier: 'test@example.com', token: '123456' })

        expect(mockAuthService.verifyForgotPasswordOTP).toHaveBeenCalledWith('test@example.com', '123456')
    })

    it('should call onSuccess callback when OTP verification succeeds', async () => {
        const onSuccess = vi.fn()
        useVerifyForgotPasswordOTPQuery(onSuccess)

        const callArgs = mockUseMutation.mock.calls[0][0]
        const responseData = { resetToken: 'reset-token-123' }
        
        callArgs.onSuccess(responseData)

        expect(onSuccess).toHaveBeenCalledWith(responseData)
    })

    it('should call onError callback when OTP verification fails', async () => {
        const onError = vi.fn()
        useVerifyForgotPasswordOTPQuery(undefined, onError)

        const callArgs = mockUseMutation.mock.calls[0][0]
        const error = new Error('Invalid OTP')
        
        callArgs.onError(error)

        expect(onError).toHaveBeenCalledWith(error)
    })
})

describe('useResetPasswordQuery', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should create mutation with correct mutationKey', () => {
        useResetPasswordQuery()

        const callArgs = mockUseMutation.mock.calls[0][0]
        expect(callArgs.mutationKey).toEqual(['resetPassword'])
    })

    it('should call resetPassword with all required parameters', async () => {
        useResetPasswordQuery()

        const callArgs = mockUseMutation.mock.calls[0][0]
        mockAuthService.resetPassword.mockResolvedValue({ success: true })

        await callArgs.mutationFn({
            identifier: 'test@example.com',
            newPassword: 'newPassword123',
            reset_token: 'reset-token-123',
        })

        expect(mockAuthService.resetPassword).toHaveBeenCalledWith(
            'test@example.com',
            'newPassword123',
            'reset-token-123',
        )
    })

    it('should call onSuccess callback when password reset succeeds', async () => {
        const onSuccess = vi.fn()
        useResetPasswordQuery(onSuccess)

        const callArgs = mockUseMutation.mock.calls[0][0]
        const responseData = { message: 'Password reset successfully' }
        
        callArgs.onSuccess(responseData)

        expect(onSuccess).toHaveBeenCalledWith(responseData)
    })

    it('should call onError callback when password reset fails', async () => {
        const onError = vi.fn()
        useResetPasswordQuery(undefined, onError)

        const callArgs = mockUseMutation.mock.calls[0][0]
        const error = new Error('Invalid reset token')
        
        callArgs.onError(error)

        expect(onError).toHaveBeenCalledWith(error)
    })

    it('should have retry set to false', () => {
        useResetPasswordQuery()

        const callArgs = mockUseMutation.mock.calls[0][0]
        expect(callArgs.retry).toBe(false)
    })
})
