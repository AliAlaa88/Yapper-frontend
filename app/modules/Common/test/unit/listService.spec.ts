import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useNuxtApp } from '#app'
import { listService } from '../../services/listService'

vi.mock('#app', () => ({
    useNuxtApp: vi.fn(),
}))

const mockUseNuxtApp = vi.mocked(useNuxtApp)

describe('listService', () => {
    let mockAxios: any

    beforeEach(() => {
        vi.clearAllMocks()

        mockAxios = {
            get: vi.fn(),
        }

        mockUseNuxtApp.mockReturnValue({
            $axios: mockAxios,
        } as any)
    })

    describe('fetchList', () => {
        it('should fetch data without cursor', async () => {
            const mockResponse = {
                data: {
                    data: {
                        data: [{ id: 1, name: 'Item 1' }],
                        pagination: {
                            next_cursor: 'cursor-2',
                            has_more: true,
                        },
                    },
                },
            }
            mockAxios.get.mockResolvedValue(mockResponse)

            const result = await listService.fetchList('/tweets', '')

            expect(mockAxios.get).toHaveBeenCalledWith('/tweets')
            expect(result).toEqual({
                data: [{ id: 1, name: 'Item 1' }],
                nextCursor: 'cursor-2',
                hasMore: true,
            })
        })

        it('should fetch data with cursor parameter', async () => {
            const mockResponse = {
                data: {
                    data: {
                        data: [{ id: 2, name: 'Item 2' }],
                        pagination: {
                            next_cursor: 'cursor-3',
                            has_more: true,
                        },
                    },
                },
            }
            mockAxios.get.mockResolvedValue(mockResponse)

            const result = await listService.fetchList('/tweets', 'cursor-2')

            expect(mockAxios.get).toHaveBeenCalledWith('/tweets?cursor=cursor-2')
            expect(result).toEqual({
                data: [{ id: 2, name: 'Item 2' }],
                nextCursor: 'cursor-3',
                hasMore: true,
            })
        })

        it('should handle paths with existing query parameters', async () => {
            const mockResponse = {
                data: {
                    data: {
                        data: [{ id: 1 }],
                        pagination: {
                            next_cursor: null,
                            has_more: false,
                        },
                    },
                },
            }
            mockAxios.get.mockResolvedValue(mockResponse)

            await listService.fetchList('/tweets?filter=latest', 'cursor-1')

            expect(mockAxios.get).toHaveBeenCalledWith('/tweets?filter=latest&cursor=cursor-1')
        })

        it('should handle last page (no next cursor)', async () => {
            const mockResponse = {
                data: {
                    data: {
                        data: [{ id: 3 }],
                        pagination: {
                            next_cursor: null,
                            has_more: false,
                        },
                    },
                },
            }
            mockAxios.get.mockResolvedValue(mockResponse)

            const result = await listService.fetchList('/tweets', 'last-cursor')

            expect(result).toEqual({
                data: [{ id: 3 }],
                nextCursor: undefined,
                hasMore: false,
            })
        })

        it('should handle alternative pagination format (next_cursor at root level)', async () => {
            const mockResponse = {
                data: {
                    data: {
                        data: [{ id: 1 }],
                        next_cursor: 'cursor-2',
                        has_more: true,
                    },
                },
            }
            mockAxios.get.mockResolvedValue(mockResponse)

            const result = await listService.fetchList('/tweets', '')

            expect(result.nextCursor).toBe('cursor-2')
            expect(result.hasMore).toBe(true)
        })

        it('should handle multiple items in response', async () => {
            const mockResponse = {
                data: {
                    data: {
                        data: [
                            { id: 1, name: 'Item 1' },
                            { id: 2, name: 'Item 2' },
                            { id: 3, name: 'Item 3' },
                        ],
                        pagination: {
                            next_cursor: 'cursor-next',
                            has_more: true,
                        },
                    },
                },
            }
            mockAxios.get.mockResolvedValue(mockResponse)

            const result = await listService.fetchList('/users', '')

            expect(result.data.length).toBe(3)
            expect(result.data[0].id).toBe(1)
            expect(result.data[2].id).toBe(3)
        })

        it('should handle empty data array', async () => {
            const mockResponse = {
                data: {
                    data: {
                        data: [],
                        pagination: {
                            next_cursor: null,
                            has_more: false,
                        },
                    },
                },
            }
            mockAxios.get.mockResolvedValue(mockResponse)

            const result = await listService.fetchList('/tweets', '')

            expect(result.data).toEqual([])
            expect(result.hasMore).toBe(false)
        })

        it('should throw error on API failure', async () => {
            const error = new Error('Network error')
            mockAxios.get.mockRejectedValue(error)

            await expect(listService.fetchList('/tweets', '')).rejects.toThrow('Network error')
        })

        it('should use correct separator for URL construction', async () => {
            const mockResponse = {
                data: {
                    data: {
                        data: [],
                        pagination: { next_cursor: null, has_more: false },
                    },
                },
            }
            mockAxios.get.mockResolvedValue(mockResponse)

            // Path without query params should use ?
            await listService.fetchList('/tweets', 'cursor-1')
            expect(mockAxios.get).toHaveBeenCalledWith('/tweets?cursor=cursor-1')

            mockAxios.get.mockClear()

            // Path with query params should use &
            await listService.fetchList('/tweets?sort=desc', 'cursor-2')
            expect(mockAxios.get).toHaveBeenCalledWith('/tweets?sort=desc&cursor=cursor-2')
        })

        it('should extract data correctly from nested response structure', async () => {
            const mockResponse = {
                data: {
                    data: {
                        data: [{ id: 1, title: 'Test' }],
                        pagination: {
                            next_cursor: 'next',
                            has_more: true,
                        },
                    },
                },
            }
            mockAxios.get.mockResolvedValue(mockResponse)

            const result = await listService.fetchList('/tweets', '')

            expect(result.data).toEqual([{ id: 1, title: 'Test' }])
            expect(result.nextCursor).toBe('next')
            expect(result.hasMore).toBe(true)
        })

        it('should handle null cursor correctly', async () => {
            const mockResponse = {
                data: {
                    data: {
                        data: [],
                        pagination: { next_cursor: null, has_more: false },
                    },
                },
            }
            mockAxios.get.mockResolvedValue(mockResponse)

            await listService.fetchList('/tweets', '')

            expect(mockAxios.get).toHaveBeenCalledWith('/tweets')
        })
    })
})

