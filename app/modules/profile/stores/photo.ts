import { defineStore } from 'pinia'

interface PhotoState {
    photoUrl: string | null
    coverUrl: string | null
}

export const useProfilePhotoStore = defineStore('profilePhoto', {
    state: (): PhotoState => ({
        photoUrl: null,
        coverUrl: null,
    }),

    actions: {
        setPhotoUrl(url: string) {
            this.photoUrl = url
        },

        clearPhotoUrl() {
            this.photoUrl = null
        },

        setCoverUrl(url: string) {
            this.coverUrl = url
        },

        clearCoverUrl() {
            this.coverUrl = null
        },
    },
})
