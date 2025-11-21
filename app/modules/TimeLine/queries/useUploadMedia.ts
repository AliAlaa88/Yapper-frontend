import { useMutation } from '@tanstack/vue-query'
import { useNuxtApp } from 'nuxt/app'

interface UploadMediaVariables {
    media: File
    type: 'image' | 'video'
}

export function useUploadMedia() {
    const { $mediaService } = useNuxtApp()
    return useMutation({
        mutationFn: ({ media, type }: UploadMediaVariables) =>
            ($mediaService as any).uploadMedia(media, type),
        onSuccess: (data) => {
            console.log('data =======>', data)
        },
        onError: (error) => {
            console.log('error =======>', error)
        },
    })
}
