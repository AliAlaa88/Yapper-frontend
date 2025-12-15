import { defineStore } from 'pinia'
export const usePasswordConfirmationStore = defineStore('passwordConfirmaiton', {
    state: () => ({
        isConfirmed: false,
        confirmedAt: null as number | null,
        sessionDuration: 30 * 60 * 1000,
    }),

    getters: {
        isSessionValid: (state) => {
            if (!state.isConfirmed || !state.confirmedAt) {
                return false
            }
            const now = Date.now()
            const time = now - state.confirmedAt

            return time < state.sessionDuration
        },
    },

    actions: {
        confirmPassword() {
            this.isConfirmed = true
            this.confirmedAt = Date.now()
            console.log('password confirmed', this.confirmedAt)
        },

        invalidateSession() {
            this.isConfirmed = false
            this.confirmedAt = null
            console.log('invalidate password')
        },

        checkSession(): boolean {
            if (this.isSessionValid) {
                return true
            }
            this.invalidateSession()
            return false
        },

        requireReconfirmation() {
            // after change password
            this.invalidateSession()
            console.log('reconfirm password')
        },
    },
})
