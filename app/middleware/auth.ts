import { useUserStore } from '../modules/auth/stores/userStore'
export default defineNuxtRouteMiddleware(async (to) => {
    const authPages = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth']
    const isAuthPage = authPages.some(page => to.path.startsWith(page))

    const token = useCookie('access_token').value

    const requiresAuth = to.meta.requiresAuth !== false

    let isAuthenticated = !!token

    const userStore = useUserStore()

    // Attempt token refresh if no access_token exists
    if (!token) {
        try {
            const { $authService } = useNuxtApp()
            const response = await $authService.GetAccessToken()
            const access_token = response.data.access_token;
            const tokenCookie = useCookie('access_token')
            tokenCookie.value = access_token;
            const fetchUserFn = async () => {
                const userResponse = await $authService.getUserData()
                return userResponse.data
            }
            userStore.setUser(await fetchUserFn())
            isAuthenticated = true
        } catch (error) {
            useCookie('access_token').value = null
            isAuthenticated = false
        }
    }

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuthenticated) {
        return navigateTo('/')
    }

    // Allow unauthenticated users to access auth pages
    if (isAuthPage) {
        return
    }

    // Protect routes that require authentication
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
