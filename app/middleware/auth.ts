import { useUserStore } from '../modules/auth/stores/userStore'
export default defineNuxtRouteMiddleware(async (to) => {
    const authPages = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth']
    const isAuthPage = authPages.some(page => to.path.startsWith(page))
    
    const token = useCookie('access_token').value

    const requiresAuth = to.meta.requiresAuth !== false

    const isToken = !!token
    let isAuthenticated = isToken

    if (isAuthPage && isToken) {
        return navigateTo('/')
    }

    if (isAuthPage) {
        return
    }

    const userStore = useUserStore()
    if (!isToken) {
        try {
            const { $authService } = useNuxtApp()
            const response = await $authService.GetAccessToken()
            const access_token = response.data.access_token;
            const token = useCookie('access_token')
            token.value = access_token;
            const fetchUserFn = async () => {
                const userResponse = await $authService.getUserData()
                return userResponse.data
            }
            userStore.setUser(await fetchUserFn())
            isAuthenticated = true
        } catch (error) {
            useCookie('access_token').value = null
            return navigateTo('/auth/login')
        }
    }

    if (requiresAuth && !isAuthenticated) {
        if (import.meta.client) {
            window.document.title = 'login'
        }
        return navigateTo('/auth')
    }

    if (!requiresAuth && isAuthenticated) {
        return navigateTo('/')
    }
})
