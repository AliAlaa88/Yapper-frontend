import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createMediaService } from '../../services/mediaService'
import { useNuxtApp } from '#app'

vi.mock('#app', () => ({
    useNuxtApp: vi.fn(),
}))

const mockUseNuxtApp = vi.mocked(useNuxtApp)

describe('createMediaService', () => {
    let mockAxios: any
    let mockFormData: any

    beforeEach(() => {
        vi.clearAllMocks()

        mockAxios = {
            post: vi.fn(),
        }

        mockUseNuxtApp.mockReturnValue({
            $axios: mockAxios,
        } as any)

        // Mock FormData
        mockFormData = {
            append: vi.fn(),
        }
        global.FormData = vi.fn(() => mockFormData) as any
    })
    describe('uploadMedia', () => {
        it('should upload image successfully', async () => {
            const mockFile = new File(['image content'], 'test.jpg', { type: 'image/jpeg' })
            const mockResponse = {
                data: {
                    url: 'https://cdn.example.com/images/abc123.jpg',
                    id: 'img-123',
                },
            }
            mockAxios.post.mockResolvedValue(mockResponse)

            const result = await createMediaService.uploadMedia(mockFile, 'image')

            expect(mockFormData.append).toHaveBeenCalledWith('file', mockFile)
            expect(mockAxios.post).toHaveBeenCalledWith(
                '/tweets/upload/image',
                mockFormData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    timeout: 60000,
                },
            )
            expect(result).toEqual(mockResponse.data)
        })

        it('should upload video successfully', async () => {
            const mockFile = new File(['video content'], 'test.mp4', { type: 'video/mp4' })
            const mockResponse = {
                data: {
                    url: 'https://cdn.example.com/videos/abc123.mp4',
                    id: 'vid-123',
                },
            }
            mockAxios.post.mockResolvedValue(mockResponse)

            const result = await createMediaService.uploadMedia(mockFile, 'video')

            expect(mockAxios.post).toHaveBeenCalledWith(
                '/tweets/upload/video',
                mockFormData,
                expect.objectContaining({
                    timeout: 60000,
                }),
            )
            expect(result).toEqual(mockResponse.data)
        })

        it('should use correct endpoint for image upload', async () => {
            const mockFile = new File([''], 'test.jpg')
            mockAxios.post.mockResolvedValue({ data: {} })

            await createMediaService.uploadMedia(mockFile, 'image')

            expect(mockAxios.post).toHaveBeenCalledWith(
                '/tweets/upload/image',
                expect.any(Object),
                expect.any(Object),
            )
        })

        it('should use correct endpoint for video upload', async () => {
            const mockFile = new File([''], 'test.mp4')
            mockAxios.post.mockResolvedValue({ data: {} })

            await createMediaService.uploadMedia(mockFile, 'video')

            expect(mockAxios.post).toHaveBeenCalledWith(
                '/tweets/upload/video',
                expect.any(Object),
                expect.any(Object),
            )
        })

        it('should set multipart form-data headers', async () => {
            const mockFile = new File([''], 'test.jpg')
            mockAxios.post.mockResolvedValue({ data: {} })

            await createMediaService.uploadMedia(mockFile, 'image')

            const callArgs = mockAxios.post.mock.calls[0]
            expect(callArgs[2]).toEqual({
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 60000,
            })
        })

        it('should append file to FormData', async () => {
            const mockFile = new File(['content'], 'test.jpg')
            mockAxios.post.mockResolvedValue({ data: {} })

            await createMediaService.uploadMedia(mockFile, 'image')

            expect(mockFormData.append).toHaveBeenCalledWith('file', mockFile)
        })

        it('should set 60 second timeout for uploads', async () => {
            const mockFile = new File([''], 'test.mp4')
            mockAxios.post.mockResolvedValue({ data: {} })

            await createMediaService.uploadMedia(mockFile, 'video')

            const callArgs = mockAxios.post.mock.calls[0]
            expect(callArgs[2].timeout).toBe(60000)
        })

        it('should return response data correctly', async () => {
            const mockFile = new File([''], 'test.jpg')
            const mockResponse = {
                data: {
                    url: 'https://example.com/image.jpg',
                    id: 'media-id',
                    width: 1920,
                    height: 1080,
                },
            }
            mockAxios.post.mockResolvedValue(mockResponse)

            const result = await createMediaService.uploadMedia(mockFile, 'image')

            expect(result).toEqual(mockResponse.data)
            expect(result.url).toBe('https://example.com/image.jpg')
            expect(result.width).toBe(1920)
        })

        it('should throw error on upload failure', async () => {
            const mockFile = new File([''], 'test.jpg')
            const error = new Error('Upload failed')
            mockAxios.post.mockRejectedValue(error)

            await expect(createMediaService.uploadMedia(mockFile, 'image')).rejects.toThrow(
                'Upload failed',
            )
        })

        it('should handle network errors', async () => {
            const mockFile = new File([''], 'test.jpg')
            const error = new Error('Network error')
            mockAxios.post.mockRejectedValue(error)

            await expect(createMediaService.uploadMedia(mockFile, 'image')).rejects.toThrow(
                'Network error',
            )
        })
    })
})

