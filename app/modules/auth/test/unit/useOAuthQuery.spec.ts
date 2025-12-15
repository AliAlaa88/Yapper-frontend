import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockAuthService = {
    OAuthCompleteStep1: vi.fn(),
    OAuthCompleteStep2: vi.fn(),
    ExchangeToken: vi.fn(),
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

const { useOAuthCompleteStep1Query, useOAuthCompleteStep2Query, useExchangeTokenQuery } = await import('../../queries/useOAuthQuery')

describe('useOAuthCompleteStep1Query', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should create mutation', () => {
        useOAuthCompleteStep1Query()

        expect(mockUseMutation).toHaveBeenCalled()
    })

    it('should call OAuthCompleteStep1 with correct parameters', async () => {
        useOAuthCompleteStep1Query()

        const callArgs = mockUseMutation.mock.calls[0][0]
        mockAuthService.OAuthCompleteStep1.mockResolvedValue({ success: true })

        await callArgs.mutationFn({
            OAuth_session_token: 'token-123',
            Birth_date: '2000-01-01',
        })

        expect(mockAuthService.OAuthCompleteStep1).toHaveBeenCalledWith('token-123', '2000-01-01')
    })

    it('should call onSuccess callback', () => {
        const onSuccess = vi.fn()
        useOAuthCompleteStep1Query(onSuccess)

        const callArgs = mockUseMutation.mock.calls[0][0]
        const responseData = { sessionToken: 'new-token' }

        callArgs.onSuccess(responseData)

        expect(onSuccess).toHaveBeenCalledWith(responseData)
    })

    it('should call onError callback', () => {
        const onError = vi.fn()
        useOAuthCompleteStep1Query(undefined, onError)

        const callArgs = mockUseMutation.mock.calls[0][0]
        const error = new Error('Invalid date')

        callArgs.onError(error)

        expect(onError).toHaveBeenCalledWith(error)
    })
})

describe('useOAuthCompleteStep2Query', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should create mutation', () => {
        useOAuthCompleteStep2Query()

        expect(mockUseMutation).toHaveBeenCalled()
    })

    it('should call OAuthCompleteStep2 with correct parameters', async () => {
        useOAuthCompleteStep2Query()

        const callArgs = mockUseMutation.mock.calls[0][0]
        mockAuthService.OAuthCompleteStep2.mockResolvedValue({ success: true })

        await callArgs.mutationFn({
            OAuth_session_token: 'token-123',
            Username: 'john_doe',
        })

        expect(mockAuthService.OAuthCompleteStep2).toHaveBeenCalledWith('token-123', 'john_doe')
    })

    it('should call onSuccess callback', () => {
        const onSuccess = vi.fn()
        useOAuthCompleteStep2Query(onSuccess)

        const callArgs = mockUseMutation.mock.calls[0][0]
        const responseData = { exchangeToken: 'exchange-token' }

        callArgs.onSuccess(responseData)

        expect(onSuccess).toHaveBeenCalledWith(responseData)
    })

    it('should call onError callback', () => {
        const onError = vi.fn()
        useOAuthCompleteStep2Query(undefined, onError)

        const callArgs = mockUseMutation.mock.calls[0][0]
        const error = new Error('Username already taken')

        callArgs.onError(error)

        expect(onError).toHaveBeenCalledWith(error)
    })
})

describe('useExchangeTokenQuery', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should create mutation', () => {
        useExchangeTokenQuery()

        expect(mockUseMutation).toHaveBeenCalled()
    })

    it('should call ExchangeToken with exchange_token', async () => {
        useExchangeTokenQuery()

        const callArgs = mockUseMutation.mock.calls[0][0]
        mockAuthService.ExchangeToken.mockResolvedValue({
            access_token: 'access-token',
            user: { id: 'user-1' },
        })

        await callArgs.mutationFn({ exchange_token: 'exchange-token-123' })

        expect(mockAuthService.ExchangeToken).toHaveBeenCalledWith('exchange-token-123')
    })

    it('should call onSuccess callback', () => {
        const onSuccess = vi.fn()
        useExchangeTokenQuery(onSuccess)

        const callArgs = mockUseMutation.mock.calls[0][0]
        const responseData = {
            access_token: 'access-token',
            user: { id: 'user-1', username: 'john' },
        }

        callArgs.onSuccess(responseData)

        expect(onSuccess).toHaveBeenCalledWith(responseData)
    })

    it('should call onError callback', () => {
        const onError = vi.fn()
        useExchangeTokenQuery(undefined, onError)

        const callArgs = mockUseMutation.mock.calls[0][0]
        const error = new Error('Invalid exchange token')

        callArgs.onError(error)

        expect(onError).toHaveBeenCalledWith(error)
    })
})
