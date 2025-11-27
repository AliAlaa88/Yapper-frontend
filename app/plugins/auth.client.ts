import { useUserStore } from '~/modules/auth/stores/userStore'

export default defineNuxtPlugin(async () => {
    const userStore = useUserStore()
    const { $authService } = useNuxtApp()

    await userStore.initAuth(async () => {
        const response = await $authService.getUserData()
        return response.data
    })
})
