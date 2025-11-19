import { useNuxtApp } from 'nuxt/app'

const urls = {
    uploadImage: '/tweets/upload/image',
    uploadVideo: '/tweets/upload/video',
}

export const mediaService = {
    async uploadMedia(media: File, type: 'image' | 'video'): Promise<string> {
        const { $axios: any } = useNuxtApp()
        const formData = new FormData()
        if (type === 'image') {
            formData.append('image', media)
        } else {
            formData.append('video', media)
        }

        const response = await $axios.post(
            type === 'image' ? urls.uploadImage : urls.uploadVideo,
            formData,
        )
        return response.data.url
    },
}
