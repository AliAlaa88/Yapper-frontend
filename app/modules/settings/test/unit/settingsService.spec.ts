import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { settingsService } from '~/modules/settings/services/settingsService'

const mockAxios = {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
}

vi.mock('nuxt/app', () => ({
    useNuxtApp: () => ({
        $axios: mockAxios,
    }),
}))

vi.spyOn(axios, 'isAxiosError').mockImplementation((error: unknown) => {
    return error instanceof Error && 'response' in error
})

describe('settingsService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should handle getMuted and getBlocked operations with success and all error scenarios', async () => {
        const mutedResponse = {
            data: { data: { data: [{ id: '1', username: 'user1' }] } },
        }
        mockAxios.get.mockResolvedValueOnce(mutedResponse)
        const mutedResult = await settingsService.getMuted()
        expect(mockAxios.get).toHaveBeenCalledWith('/users/me/muted', { params: {} })
        expect(mutedResult).toEqual(mutedResponse.data)

        mockAxios.get.mockResolvedValueOnce(mutedResponse)
        await settingsService.getMuted('cursor123')
        expect(mockAxios.get).toHaveBeenCalledWith('/users/me/muted', { params: { cursor: 'cursor123' } })


        const error401 = new Error('Unauthorized') as any
        error401.response = { status: 401 }
        mockAxios.get.mockRejectedValueOnce(error401)
        await expect(settingsService.getMuted()).rejects.toThrow('Invalid or expired token')

        const error404 = new Error('Not Found') as any
        error404.response = { status: 404 }
        mockAxios.get.mockRejectedValueOnce(error404)
        await expect(settingsService.getMuted()).rejects.toThrow('Muted users not found')

        mockAxios.get.mockRejectedValueOnce(new Error('Network error'))
        await expect(settingsService.getMuted()).rejects.toThrow('Something went wrong')

        const blockedResponse = {
            data: { data: [{ id: '1', username: 'blocked1' }] },
        }
        mockAxios.get.mockResolvedValueOnce(blockedResponse)
        const blockedResult = await settingsService.getBlocked()
        expect(blockedResult).toEqual(blockedResponse.data)

        mockAxios.get.mockResolvedValueOnce(blockedResponse)
        await settingsService.getBlocked('cursor456')
        expect(mockAxios.get).toHaveBeenCalledWith('/users/me/blocked', { params: { cursor: 'cursor456' } })

        mockAxios.get.mockRejectedValueOnce(error401)
        await expect(settingsService.getBlocked()).rejects.toThrow('Invalid or expired token')

        mockAxios.get.mockRejectedValueOnce(error404)
        await expect(settingsService.getBlocked()).rejects.toThrow('Blocked users not found')

        mockAxios.get.mockRejectedValueOnce(new Error('Network error'))
        await expect(settingsService.getBlocked()).rejects.toThrow('Something went wrong')
    })

    it('should handle changePassword with success and all error codes (401, 400, 404, generic)', async () => {
        const successResponse = { data: { message: 'Password changed', success: true } }
        mockAxios.post.mockResolvedValueOnce(successResponse)
        const result = await settingsService.changePassword('oldPass', 'newPass')
        expect(result).toEqual(successResponse.data)

        const error401 = new Error('Unauthorized') as any
        error401.response = { status: 401, data: { message: 'Wrong password' } }
        mockAxios.post.mockRejectedValueOnce(error401)
        await expect(settingsService.changePassword('old', 'new')).rejects.toThrow('Wrong password')

        const error400 = new Error('Bad Request') as any
        error400.response = { status: 400, data: { message: 'Invalid format' } }
        mockAxios.post.mockRejectedValueOnce(error400)
        await expect(settingsService.changePassword('old', 'new')).rejects.toThrow('Invalid format')

        const error404 = new Error('Not Found') as any
        error404.response = { status: 404 }
        mockAxios.post.mockRejectedValueOnce(error404)
        await expect(settingsService.changePassword('old', 'new')).rejects.toThrow('User not found')

        mockAxios.post.mockRejectedValueOnce(new Error('Network'))
        await expect(settingsService.changePassword('old', 'new')).rejects.toThrow('Failed to change password')
    })

    it('should handle deleteAccount and confirmPassword with all error scenarios', async () => {
        const deleteResponse = { data: { message: 'Deleted' } }
        mockAxios.delete.mockResolvedValueOnce(deleteResponse)
        const deleteResult = await settingsService.deleteAccount()
        expect(deleteResult).toEqual(deleteResponse.data)

        const error401 = new Error('Unauthorized') as any
        error401.response = { status: 401 }
        mockAxios.delete.mockRejectedValueOnce(error401)
        await expect(settingsService.deleteAccount()).rejects.toThrow('Invalid or expired token')

        const error404 = new Error('Not Found') as any
        error404.response = { status: 404 }
        mockAxios.delete.mockRejectedValueOnce(error404)
        await expect(settingsService.deleteAccount()).rejects.toThrow('User not found')

        mockAxios.delete.mockRejectedValueOnce(new Error('Network'))
        await expect(settingsService.deleteAccount()).rejects.toThrow('Failed to delete account')

        const confirmResponse = { data: { confirmed: true } }
        mockAxios.post.mockResolvedValueOnce(confirmResponse)
        const confirmResult = await settingsService.confirmPassword('password')
        expect(confirmResult).toEqual(confirmResponse.data)

        const error403 = new Error('Forbidden') as any
        error403.response = { status: 403 }
        mockAxios.post.mockRejectedValueOnce(error403)
        await expect(settingsService.confirmPassword('wrong')).rejects.toThrow('WRONG_PASSWORD')

        const error409 = new Error('Conflict') as any
        error409.response = { status: 409 }
        mockAxios.post.mockRejectedValueOnce(error409)
        await expect(settingsService.confirmPassword('pass')).rejects.toThrow('NO_PASSWORD_SET')

        mockAxios.post.mockRejectedValueOnce(error404)
        await expect(settingsService.confirmPassword('pass')).rejects.toThrow('USER_NOT_FOUND')

        mockAxios.post.mockRejectedValueOnce(new Error('Network'))
        await expect(settingsService.confirmPassword('pass')).rejects.toThrow('UNKNOWN')
    })

    it('should handle updateUsername and getUsernameRecommendations with all errors', async () => {
        const usernameResponse = { data: { data: { username: 'newname' } } }
        mockAxios.post.mockResolvedValueOnce(usernameResponse)
        const result = await settingsService.updateUsername('newname')
        expect(result).toEqual(usernameResponse.data)

        const error401 = new Error('Unauthorized') as any
        error401.response = { status: 401 }
        mockAxios.post.mockRejectedValueOnce(error401)
        await expect(settingsService.updateUsername('name')).rejects.toThrow('Invalid or expired token')

        const error404 = new Error('Not Found') as any
        error404.response = { status: 404 }
        mockAxios.post.mockRejectedValueOnce(error404)
        await expect(settingsService.updateUsername('name')).rejects.toThrow('User not found')

        const error409 = new Error('Conflict') as any
        error409.response = { status: 409 }
        mockAxios.post.mockRejectedValueOnce(error409)
        await expect(settingsService.updateUsername('taken')).rejects.toThrow('Username is already taken')

        const error400 = new Error('Bad Request') as any
        error400.response = { status: 400, data: { message: 'Too short' } }
        mockAxios.post.mockRejectedValueOnce(error400)
        await expect(settingsService.updateUsername('ab')).rejects.toThrow('Too short')

        mockAxios.post.mockRejectedValueOnce(new Error('Network'))
        await expect(settingsService.updateUsername('name')).rejects.toThrow('Failed to update username')

        const recsResponse = { data: { recommendations: ['user1', 'user2'] } }
        mockAxios.get.mockResolvedValueOnce(recsResponse)
        const recsResult = await settingsService.getUsernameRecommendations()
        expect(recsResult).toEqual(recsResponse.data)

        mockAxios.get.mockRejectedValueOnce(error401)
        await expect(settingsService.getUsernameRecommendations()).rejects.toThrow('Invalid or expired token')

        mockAxios.get.mockRejectedValueOnce(error404)
        await expect(settingsService.getUsernameRecommendations()).rejects.toThrow('User not found')

        mockAxios.get.mockRejectedValueOnce(new Error('Network'))
        await expect(settingsService.getUsernameRecommendations()).rejects.toThrow('Failed to get username recommendations')
    })

    it('should handle sendEmailOTP with all error scenarios', async () => {
        const sendResponse = { data: { message: 'OTP sent' } }
        mockAxios.post.mockResolvedValueOnce(sendResponse)
        const result = await settingsService.sendEmailOTP('email@test.com')
        expect(result).toEqual(sendResponse.data)

        const errorBackend = new Error('Custom') as any
        errorBackend.response = { status: 400, data: { message: 'Email exists' } }
        mockAxios.post.mockRejectedValueOnce(errorBackend)
        await expect(settingsService.sendEmailOTP('email@test.com')).rejects.toThrow('Email exists')

        const errorField = new Error('Custom') as any
        errorField.response = { status: 400, data: { error: 'Invalid format' } }
        mockAxios.post.mockRejectedValueOnce(errorField)
        await expect(settingsService.sendEmailOTP('email@test.com')).rejects.toThrow('Invalid format')

        const error401 = new Error('Unauthorized') as any
        error401.response = { status: 401, data: {} }
        mockAxios.post.mockRejectedValueOnce(error401)
        await expect(settingsService.sendEmailOTP('email@test.com')).rejects.toThrow('Invalid or expired token')

        const error404 = new Error('Not Found') as any
        error404.response = { status: 404, data: {} }
        mockAxios.post.mockRejectedValueOnce(error404)
        await expect(settingsService.sendEmailOTP('email@test.com')).rejects.toThrow('User not found')

        // 400 error without message
        const error400 = new Error('Bad Request') as any
        error400.response = { status: 400, data: {} }
        mockAxios.post.mockRejectedValueOnce(error400)
        await expect(settingsService.sendEmailOTP('email@test.com')).rejects.toThrow('Email already exists')

        // 500 error
        const error500 = new Error('Server Error') as any
        error500.response = { status: 500, data: {} }
        mockAxios.post.mockRejectedValueOnce(error500)
        await expect(settingsService.sendEmailOTP('email@test.com')).rejects.toThrow('Failed to send OTP email')

        mockAxios.post.mockRejectedValueOnce(new Error('Network'))
        await expect(settingsService.sendEmailOTP('email@test.com')).rejects.toThrow('Failed to send verification code')
    })

    it('should handle verifyEmailOTP and changeLanguage with all error scenarios', async () => {
        const verifyResponse = { data: { message: 'Verified' } }
        mockAxios.post.mockResolvedValueOnce(verifyResponse)
        const result = await settingsService.verifyEmailOTP('email@test.com', '123456')
        expect(result).toEqual(verifyResponse.data)

        const errorBackend = new Error('Custom') as any
        errorBackend.response = { status: 400, data: { message: 'OTP expired' } }
        mockAxios.post.mockRejectedValueOnce(errorBackend)
        await expect(settingsService.verifyEmailOTP('email@test.com', '123')).rejects.toThrow('OTP expired')

        // verifyEmailOTP 400 without message
        const error400 = new Error('Bad Request') as any
        error400.response = { status: 400, data: {} }
        mockAxios.post.mockRejectedValueOnce(error400)
        await expect(settingsService.verifyEmailOTP('email@test.com', '123')).rejects.toThrow('Invalid or expired OTP')

        // 401
        const error401 = new Error('Unauthorized') as any
        error401.response = { status: 401, data: {} }
        mockAxios.post.mockRejectedValueOnce(error401)
        await expect(settingsService.verifyEmailOTP('email@test.com', '123')).rejects.toThrow('Invalid or expired token')

        const error404 = new Error('Not Found') as any
        error404.response = { status: 404, data: {} }
        mockAxios.post.mockRejectedValueOnce(error404)
        await expect(settingsService.verifyEmailOTP('email@test.com', '123')).rejects.toThrow('User not found')

        mockAxios.post.mockRejectedValueOnce(new Error('Network'))
        await expect(settingsService.verifyEmailOTP('email@test.com', '123')).rejects.toThrow('Failed to verify email')

        const langResponse = { data: { message: 'Language changed' } }
        mockAxios.patch.mockResolvedValueOnce(langResponse)
        const langResult = await settingsService.changeLanguage('ar')
        expect(langResult).toBe('Language changed')
        mockAxios.patch.mockRejectedValueOnce(error401)
        await expect(settingsService.changeLanguage('en')).rejects.toThrow('Invalid or expired token')
        mockAxios.patch.mockRejectedValueOnce(new Error('Network'))
        await expect(settingsService.changeLanguage('en')).rejects.toThrow('Something went wrong')
    })
})
