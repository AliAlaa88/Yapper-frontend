import { useUserStore } from '../modules/auth/stores/userStore'
export default defineNuxtRouteMiddleware(async (to) => {
    const token = useCookie('access_token').value

    // Check if route requires authentication
    const requiresAuth = to.meta.requiresAuth !== false

    // Use token from cookie as the source of truth for auth state
    const isToken = !!token
    let isAuthenticated = isToken

    // If token exists but user store is not initialized, try to initialize it by sending refresh request
    const userStore = useUserStore()
    if (!isToken && userStore.isLoggedIn) {
            const { $authService } = useNuxtApp()
            const response = await $authService.GetAccessToken()
            const access_token = response.data.access_token;
            const token = useCookie('access_token')
            token.value = access_token;
            userStore.setAuth(response.data)
            isAuthenticated = true
    }



    if (requiresAuth && !isAuthenticated) {
        // Redirect to auth if trying to access protected route without authentication
        if (import.meta.client) {
            window.document.title = 'login'
        }
        return navigateTo('/auth')
    }

    if (!requiresAuth && isAuthenticated) {
        // Redirect to home if trying to access auth pages while already authenticated
        return navigateTo('/')
    }
})
