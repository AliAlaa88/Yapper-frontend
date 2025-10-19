import { defineStore } from 'pinia'

interface PhotoState {
    photoUrl: string | null
}

export const useProfilePhotoStore = defineStore('profilePhoto', {
    state: (): PhotoState => ({
        photoUrl: null,
    }),

    actions: {
        setPhotoUrl(url: string) {
            this.photoUrl = url
        },

        clearPhotoUrl() {
            this.photoUrl = null
        },
    },
})
