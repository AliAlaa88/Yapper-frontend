import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockYapperApi = {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
}

vi.mock('nuxt/app', () => ({
    useNuxtApp: () => ({
        $yapperApi: mockYapperApi,
    }),
    useRuntimeConfig: () => ({
        public: {
            apiUrl: 'http://api.example.com',
        },
    }),
}))

const { createAuthService } = await import('../../services')

describe('Auth Service', () => {
    let authService: ReturnType<typeof createAuthService>

    beforeEach(() => {
        vi.clearAllMocks()
        authService = createAuthService()
    })

    it('should create auth service', () => {
        expect(authService).toBeDefined()
        expect(typeof authService).toBe('object')
    })

    it('should have checkIdentifierAvailability method', async () => {
        expect(authService.checkIdentifierAvailability).toBeDefined()
        mockYapperApi.post.mockResolvedValue({ data: { available: true } })
        const result = await authService.checkIdentifierAvailability('test')
        expect(mockYapperApi.post).toHaveBeenCalled()
        expect(result.available).toBe(true)
    })

    it('should have login method', async () => {
        expect(authService.login).toBeDefined()
        mockYapperApi.post.mockResolvedValue({ data: { access_token: 'token' } })
        const result = await authService.login('user', 'pass', 'email')
        expect(mockYapperApi.post).toHaveBeenCalled()
        expect(result.access_token).toBe('token')
    })

    it('should have registerStep1 method', async () => {
        expect(authService.registerStep1).toBeDefined()
        mockYapperApi.post.mockResolvedValue({ data: { otp_sent: true } })
        const result = await authService.registerStep1({
            Name: 'John',
            Email: 'john@example.com',
            Birth_date: '1990-01-01',
            Captcha_token: 'captcha',
        })
        expect(mockYapperApi.post).toHaveBeenCalled()
        expect(result.otp_sent).toBe(true)
    })

    it('should have registerStep2 method', async () => {
        expect(authService.registerStep2).toBeDefined()
        mockYapperApi.post.mockResolvedValue({ data: { email_verified: true } })
        const result = await authService.registerStep2({
            Email: 'john@example.com',
            token: 'otp123',
        })
        expect(mockYapperApi.post).toHaveBeenCalled()
        expect(result.email_verified).toBe(true)
    })

    it('should have registerStep3 method', async () => {
        expect(authService.registerStep3).toBeDefined()
        mockYapperApi.post.mockResolvedValue({ data: { success: true } })
        const result = await authService.registerStep3({
            Email: 'john@example.com',
            Password: 'pass',
            Username: 'john',
            Language: 'en',
        })
        expect(mockYapperApi.post).toHaveBeenCalled()
        expect(result.success).toBe(true)
    })

    it('should have resendOTP method', async () => {
        expect(authService.resendOTP).toBeDefined()
        mockYapperApi.post.mockResolvedValue({ data: { otp_sent: true } })
        const result = await authService.resendOTP('john@example.com')
        expect(mockYapperApi.post).toHaveBeenCalled()
        expect(result.otp_sent).toBe(true)
    })

    it('should have forgotPassword method', async () => {
        expect(authService.forgotPassword).toBeDefined()
        mockYapperApi.post.mockResolvedValue({ data: { reset_token_sent: true } })
        const result = await authService.forgotPassword('user@example.com')
        expect(mockYapperApi.post).toHaveBeenCalled()
        expect(result.reset_token_sent).toBe(true)
    })

    it('should have verifyForgotPasswordOTP method', async () => {
        expect(authService.verifyForgotPasswordOTP).toBeDefined()
        mockYapperApi.post.mockResolvedValue({ data: { otp_verified: true } })
        const result = await authService.verifyForgotPasswordOTP('user@example.com', '123456')
        expect(mockYapperApi.post).toHaveBeenCalled()
        expect(result.otp_verified).toBe(true)
    })

    it('should have resetPassword method', async () => {
        expect(authService.resetPassword).toBeDefined()
        mockYapperApi.post.mockResolvedValue({ data: { password_reset: true } })
        const result = await authService.resetPassword('user@example.com', 'newpass', 'token')
        expect(mockYapperApi.post).toHaveBeenCalled()
        expect(result.password_reset).toBe(true)
    })

    it('should have OAuthCompleteStep1 method', async () => {
        expect(authService.OAuthCompleteStep1).toBeDefined()
        mockYapperApi.post.mockResolvedValue({ data: { step_completed: true } })
        const result = await authService.OAuthCompleteStep1('oauth_token', '1990-01-01')
        expect(mockYapperApi.post).toHaveBeenCalled()
        expect(result.step_completed).toBe(true)
    })

    it('should have OAuthCompleteStep2 method', async () => {
        expect(authService.OAuthCompleteStep2).toBeDefined()
        mockYapperApi.post.mockResolvedValue({ data: { step_completed: true } })
        const result = await authService.OAuthCompleteStep2('oauth_token', 'username')
        expect(mockYapperApi.post).toHaveBeenCalled()
        expect(result.step_completed).toBe(true)
    })

    it('should have getUserData method', async () => {
        expect(authService.getUserData).toBeDefined()
        mockYapperApi.get.mockResolvedValue({ data: { id: 'user1' } })
        const result = await authService.getUserData()
        expect(mockYapperApi.get).toHaveBeenCalled()
        expect(result.id).toBe('user1')
    })

    it('should have logout method', async () => {
        expect(authService.logout).toBeDefined()
        mockYapperApi.post.mockResolvedValue({ data: { success: true } })
        const result = await authService.logout()
        expect(mockYapperApi.post).toHaveBeenCalled()
        expect(result.success).toBe(true)
    })

    it('should have GetAccessToken method', async () => {
        expect(authService.GetAccessToken).toBeDefined()
        mockYapperApi.post.mockResolvedValue({ data: { access_token: 'new_token' } })
        const result = await authService.GetAccessToken()
        expect(mockYapperApi.post).toHaveBeenCalled()
        expect(result.access_token).toBe('new_token')
    })

    it('should have ExchangeToken method', async () => {
        expect(authService.ExchangeToken).toBeDefined()
        mockYapperApi.post.mockResolvedValue({ data: { access_token: 'exchanged' } })
        const result = await authService.ExchangeToken('temp_token')
        expect(mockYapperApi.post).toHaveBeenCalled()
        expect(result.access_token).toBe('exchanged')
    })

    it('should have updateProfilePicture method', async () => {
        expect(authService.updateProfilePicture).toBeDefined()
        mockYapperApi.post.mockResolvedValue({ data: { avatar_url: 'url' } })
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
        const result = await authService.updateProfilePicture(file)
        expect(mockYapperApi.post).toHaveBeenCalled()
        expect(result.avatar_url).toBe('url')
    })

    it('should have updateUsername method', async () => {
        expect(authService.updateUsername).toBeDefined()
        mockYapperApi.post.mockResolvedValue({ data: { username: 'newname' } })
        const result = await authService.updateUsername('newname')
        expect(mockYapperApi.post).toHaveBeenCalled()
        expect(result.username).toBe('newname')
    })

    it('should have updateLanguage method', async () => {
        expect(authService.updateLanguage).toBeDefined()
        mockYapperApi.patch.mockResolvedValue({ data: { language: 'ar' } })
        const result = await authService.updateLanguage('ar')
        expect(mockYapperApi.patch).toHaveBeenCalled()
        expect(result.language).toBe('ar')
    })

    it('should have getInterests method', async () => {
        expect(authService.getInterests).toBeDefined()
        const categories = [{ id: 1, name: 'Tech' }]
        mockYapperApi.get.mockResolvedValue({ data: categories })
        const result = await authService.getInterests()
        expect(mockYapperApi.get).toHaveBeenCalled()
        expect(result).toEqual(categories)
    })

    it('should have updateInterests method', async () => {
        expect(authService.updateInterests).toBeDefined()
        mockYapperApi.post.mockResolvedValue({ data: { interests: [1, 2] } })
        const result = await authService.updateInterests([1, 2])
        expect(mockYapperApi.post).toHaveBeenCalled()
        expect(result.interests).toEqual([1, 2])
    })

    it('should have updateProfile method', async () => {
        expect(authService.updateProfile).toBeDefined()
        mockYapperApi.patch.mockResolvedValue({ data: { avatar_url: 'new_url' } })
        const result = await authService.updateProfile('new_url')
        expect(mockYapperApi.patch).toHaveBeenCalled()
        expect(result.avatar_url).toBe('new_url')
    })
})
