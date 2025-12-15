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

    it('should successfully change password', async () => {
        const mockResponse = {
            data: {
                message: 'Password changed successfully',
                success: true,
            },
        }

        mockAxios.post.mockResolvedValueOnce(mockResponse)
        const result = await settingsService.changePassword('oldPass123', 'newPass456')

        expect(mockAxios.post).toHaveBeenCalledWith('/auth/change-password', {
            old_password: 'oldPass123',
            new_password: 'newPass456',
        })
        expect(result).toEqual(mockResponse.data)
    })

    it('should throw error on wrong password (401) and invalid format (400)', async () => {
        const error401 = new Error('Unauthorized') as any
        error401.response = {
            status: 401,
            data: { message: 'Wrong password' },
        }

        mockAxios.post.mockRejectedValueOnce(error401)
        await expect(settingsService.changePassword('oldPass', 'newPass')).rejects.toThrow(
            'Wrong password',
        )

        const error400 = new Error('Bad Request') as any
        error400.response = {
            status: 400,
            data: { message: 'Invalid password format' },
        }

        mockAxios.post.mockRejectedValueOnce(error400)
        await expect(settingsService.changePassword('old', 'new')).rejects.toThrow(
            'Invalid password format',
        )
    })

    it('should successfully update username and handle duplicate/invalid errors', async () => {
        const mockResponse = {
            data: {
                data: { username: 'newusername' },
                message: 'Username updated successfully',
            },
        }

        mockAxios.post.mockResolvedValueOnce(mockResponse)
        const result = await settingsService.updateUsername('newusername')

        expect(mockAxios.post).toHaveBeenCalledWith('/auth/update-username', {
            username: 'newusername',
        })
        expect(result).toEqual(mockResponse.data)

        const error409 = new Error('Conflict') as any
        error409.response = { status: 409 }

        mockAxios.post.mockRejectedValueOnce(error409)
        await expect(settingsService.updateUsername('taken')).rejects.toThrow(
            'Username is already taken',
        )

        const error400 = new Error('Bad Request') as any
        error400.response = {
            status: 400,
            data: { message: 'Username too short' },
        }

        mockAxios.post.mockRejectedValueOnce(error400)
        await expect(settingsService.updateUsername('ab')).rejects.toThrow('Username too short')
    })

    it('should handle email OTP operations and verify email with various error codes', async () => {
        const sendResponse = {
            data: {
                message: 'OTP sent to email',
            },
        }

        mockAxios.post.mockResolvedValueOnce(sendResponse)
        const sendResult = await settingsService.sendEmailOTP('newemail@example.com')

        expect(mockAxios.post).toHaveBeenCalledWith('/auth/update-email', {
            new_email: 'newemail@example.com',
        })
        expect(sendResult).toEqual(sendResponse.data)

        const verifyResponse = {
            data: {
                message: 'Email verified successfully',
            },
        }

        mockAxios.post.mockResolvedValueOnce(verifyResponse)
        const verifyResult = await settingsService.verifyEmailOTP('newemail@example.com', '123456')

        expect(mockAxios.post).toHaveBeenCalledWith('/auth/update-email/verify', {
            new_email: 'newemail@example.com',
            otp: '123456',
        })
        expect(verifyResult).toEqual(verifyResponse.data)

        const errorBackend = new Error('Custom error') as any
        errorBackend.response = {
            status: 400,
            data: { error: 'OTP expired' },
        }

        mockAxios.post.mockRejectedValueOnce(errorBackend)
        await expect(
            settingsService.verifyEmailOTP('email@example.com', '123'),
        ).rejects.toThrow('OTP expired')
    })

    it('should handle language change and account operations with various status codes', async () => {
        const langResponse = {
            data: {
                message: 'Language changed to Arabic',
            },
        }

        mockAxios.patch.mockResolvedValueOnce(langResponse)
        const langResult = await settingsService.changeLanguage('ar')

        expect(mockAxios.patch).toHaveBeenCalledWith('/users/me/change-language', {
            language: 'ar',
        })
        expect(langResult).toBe(langResponse.data.message)

        const deleteResponse = {
            data: {
                message: 'Account deleted successfully',
            },
        }

        mockAxios.delete.mockResolvedValueOnce(deleteResponse)
        const deleteResult = await settingsService.deleteAccount()

        expect(mockAxios.delete).toHaveBeenCalledWith('/users/me/delete-account')
        expect(deleteResult).toEqual(deleteResponse.data)


        const error401 = new Error('Unauthorized') as any
        error401.response = { status: 401 }

        mockAxios.patch.mockRejectedValueOnce(error401)
        await expect(settingsService.changeLanguage('en')).rejects.toThrow(
            'Invalid or expired token',
        )
    })

    it('should handle confirm password with all error scenarios and fetch user lists', async () => {

        const confirmResponse = {
            data: {
                confirmed: true,
            },
        }

        mockAxios.post.mockResolvedValueOnce(confirmResponse)
        const confirmResult = await settingsService.confirmPassword('password123')

        expect(mockAxios.post).toHaveBeenCalledWith('/auth/confirm-password', {
            password: 'password123',
        })
        expect(confirmResult).toEqual(confirmResponse.data)

        const error403 = new Error('Forbidden') as any
        error403.response = { status: 403 }

        mockAxios.post.mockRejectedValueOnce(error403)
        await expect(settingsService.confirmPassword('wrong')).rejects.toThrow('WRONG_PASSWORD')


        const error409 = new Error('Conflict') as any
        error409.response = { status: 409 }

        mockAxios.post.mockRejectedValueOnce(error409)
        await expect(settingsService.confirmPassword('pass')).rejects.toThrow('NO_PASSWORD_SET')


        const mutedResponse = {
            data: {
                data: {
                    data: [
                        { id: '1', username: 'user1' },
                        { id: '2', username: 'user2' },
                    ],
                },
            },
        }

        mockAxios.get.mockResolvedValueOnce(mutedResponse)
        const mutedResult = await settingsService.getMuted()

        expect(mockAxios.get).toHaveBeenCalledWith('/users/me/muted', { params: {} })
        expect(mutedResult).toEqual(mutedResponse.data)

        const mutedCursorResponse = {
            data: {
                data: {
                    data: [{ id: '3', username: 'user3' }],
                },
            },
        }

        mockAxios.get.mockResolvedValueOnce(mutedCursorResponse)
        const mutedCursorResult = await settingsService.getMuted('cursor123')

        expect(mockAxios.get).toHaveBeenCalledWith('/users/me/muted', {
            params: { cursor: 'cursor123' },
        })
        expect(mutedCursorResult).toEqual(mutedCursorResponse.data)


        const blockedResponse = {
            data: {
                data: [
                    { id: '1', username: 'blocked1' },
                    { id: '2', username: 'blocked2' },
                ],
            },
        }

        mockAxios.get.mockResolvedValueOnce(blockedResponse)
        const blockedResult = await settingsService.getBlocked()

        expect(mockAxios.get).toHaveBeenCalledWith('/users/me/blocked', { params: {} })
        expect(blockedResult).toEqual(blockedResponse.data)


        const recsResponse = {
            data: {
                recommendations: ['user_123', 'user_456', 'user_789'],
            },
        }

        mockAxios.get.mockResolvedValueOnce(recsResponse)
        const recsResult = await settingsService.getUsernameRecommendations()

        expect(mockAxios.get).toHaveBeenCalledWith('/users/me/username-recommendations')
        expect(recsResult).toEqual(recsResponse.data)
    })
})
