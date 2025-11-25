import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createUserInfoService } from '../../services/index'

const { mockUserInfoServiceReal, mockUserInfoServiceMock, mockUseRuntimeConfig } = vi.hoisted(() => ({
    mockUserInfoServiceReal: {
        getMe: vi.fn(),
        getUserInfoByUsername: vi.fn(),
    },
    mockUserInfoServiceMock: {
        getMe: vi.fn(),
        getUserInfoByUsername: vi.fn(),
    },
    mockUseRuntimeConfig: vi.fn()
}))

vi.mock('../../services/userInfoService.real', () => ({
    userInfoServiceReal: mockUserInfoServiceReal,
}))

vi.mock('../../services/userInfoService.mock', () => ({
    userInfoServiceMock: mockUserInfoServiceMock,
}))

vi.mock('#app', () => ({
    useRuntimeConfig: mockUseRuntimeConfig
}))

describe('createUserInfoService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns real service when mockApi is false', () => {
        mockUseRuntimeConfig.mockReturnValue({
            public: {
                mockApi: 'false',
            },
        })

        const service = createUserInfoService()
        expect(service).toBe(mockUserInfoServiceReal)
    })

    it('returns mock service when mockApi is true', () => {
        mockUseRuntimeConfig.mockReturnValue({
            public: {
                mockApi: 'true',
            },
        })

        const service = createUserInfoService()
        expect(service).toBe(mockUserInfoServiceMock)
    })
})
