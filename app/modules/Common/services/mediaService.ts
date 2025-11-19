import { useNuxtApp } from 'nuxt/app'
const urls = {
    uploadImage: '/tweets/upload/image',
    uploadVideo: '/tweets/upload/video',
}

interface UploadMediaResponse {
    data: {
        url: string
        filename: string
        size: number
        mime_type: string
    }
    count: number
    message: string
}

export const createMediaService = {
    async uploadMedia(media: File, type: 'image' | 'video'): Promise<UploadMediaResponse> {
        const { $axios } = useNuxtApp()
        const formData = new FormData()

        formData.append('file', media)

        const response = await ($axios as any).post(
            type === 'image' ? urls.uploadImage : urls.uploadVideo,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        )
        return response.data
    },
}
