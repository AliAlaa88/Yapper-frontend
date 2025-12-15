import { describe, it, expect, vi, beforeEach } from 'vitest'

let lastMutationOptions: any
let mockMediaService: any
let mockNuxtApp: any

vi.mock('nuxt/app', () => ({
    useNuxtApp: () => mockNuxtApp,
}))

vi.mock('@tanstack/vue-query', () => ({
    useMutation: (options: any) => {
        lastMutationOptions = options
        return {
            mutate: vi.fn(),
            mutateAsync: vi.fn(async (variables: any) => {
                return options.mutationFn(variables)
            }),
            isPending: { value: false },
            isError: { value: false },
            isSuccess: { value: false },
        }
    },
}))

const { useUploadMedia } = await import('../../queries/useUploadMedia')

describe('useUploadMedia', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        lastMutationOptions = null

        mockMediaService = {
            uploadMedia: vi.fn(async (file: File, type: string) => ({
                url: `https://example.com/uploaded-${Date.now()}.jpg`,
            })),
        }

        mockNuxtApp = {
            $mediaService: mockMediaService,
        }
    })

    it('should create mutation for media upload', () => {
        const mutation = useUploadMedia()
        expect(mutation).toBeDefined()
        expect(lastMutationOptions).toBeDefined()
        expect(lastMutationOptions.mutationFn).toBeDefined()
    })

    it('should call mutationFn with correct parameters', async () => {
        const mutation = useUploadMedia()
        const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })

        await mutation.mutateAsync({ media: mockFile, type: 'image' })

        expect(mockMediaService.uploadMedia).toHaveBeenCalledWith(mockFile, 'image')
    })

    it('should handle image upload correctly', async () => {
        const mutation = useUploadMedia()
        const mockFile = new File(['image'], 'photo.jpg', { type: 'image/jpeg' })

        await mutation.mutateAsync({ media: mockFile, type: 'image' })

        expect(mockMediaService.uploadMedia).toHaveBeenCalledWith(mockFile, 'image')
    })

    it('should handle video upload correctly', async () => {
        const mutation = useUploadMedia()
        const mockFile = new File(['video'], 'video.mp4', { type: 'video/mp4' })

        await mutation.mutateAsync({ media: mockFile, type: 'video' })

        expect(mockMediaService.uploadMedia).toHaveBeenCalledWith(mockFile, 'video')
    })

    it('should return uploaded file URL', async () => {
        const mutation = useUploadMedia()
        const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
        const expectedUrl = 'https://example.com/uploaded-file.jpg'

        mockMediaService.uploadMedia.mockResolvedValueOnce({ url: expectedUrl })

        const result = await mutation.mutateAsync({ media: mockFile, type: 'image' })

        expect(result.url).toBe(expectedUrl)
    })

    it('should handle upload errors gracefully', async () => {
        const mutation = useUploadMedia()
        const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
        const error = new Error('Network error')

        mockMediaService.uploadMedia.mockRejectedValueOnce(error)

        await expect(
            mutation.mutateAsync({ media: mockFile, type: 'image' })
        ).rejects.toThrow('Network error')
    })

    it('should support multiple file uploads', async () => {
        const mutation = useUploadMedia()
        const file1 = new File(['content1'], 'file1.jpg', { type: 'image/jpeg' })
        const file2 = new File(['content2'], 'file2.png', { type: 'image/png' })

        mockMediaService.uploadMedia
            .mockResolvedValueOnce({ url: 'https://example.com/file1.jpg' })
            .mockResolvedValueOnce({ url: 'https://example.com/file2.png' })

        const result1 = await mutation.mutateAsync({ media: file1, type: 'image' })
        const result2 = await mutation.mutateAsync({ media: file2, type: 'image' })

        expect(result1.url).toBe('https://example.com/file1.jpg')
        expect(result2.url).toBe('https://example.com/file2.png')
        expect(mockMediaService.uploadMedia).toHaveBeenCalledTimes(2)
    })

    it('should handle large file uploads', async () => {
        const mutation = useUploadMedia()
        const largeFile = new File(['x'.repeat(10 * 1024 * 1024)], 'large.mp4', { type: 'video/mp4' })

        mockMediaService.uploadMedia.mockResolvedValueOnce({ url: 'https://example.com/large.mp4' })

        const result = await mutation.mutateAsync({ media: largeFile, type: 'video' })

        expect(mockMediaService.uploadMedia).toHaveBeenCalledWith(largeFile, 'video')
        expect(result.url).toBe('https://example.com/large.mp4')
    })

    it('should return mutation object with mutate method', () => {
        const mutation = useUploadMedia()
        expect(mutation).toHaveProperty('mutate')
        expect(typeof mutation.mutate).toBe('function')
    })

    it('should return mutation object with mutateAsync method', () => {
        const mutation = useUploadMedia()
        expect(mutation).toHaveProperty('mutateAsync')
        expect(typeof mutation.mutateAsync).toBe('function')
    })

    it('should handle different file types', async () => {
        const mutation = useUploadMedia()
        const imageFile = new File(['img'], 'test.jpg', { type: 'image/jpeg' })
        const videoFile = new File(['vid'], 'test.mp4', { type: 'video/mp4' })

        mockMediaService.uploadMedia.mockClear()

        await mutation.mutateAsync({ media: imageFile, type: 'image' })
        await mutation.mutateAsync({ media: videoFile, type: 'video' })

        expect(mockMediaService.uploadMedia).toHaveBeenNthCalledWith(1, imageFile, 'image')
        expect(mockMediaService.uploadMedia).toHaveBeenNthCalledWith(2, videoFile, 'video')
    })
})
