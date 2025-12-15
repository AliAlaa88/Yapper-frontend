import { useUserStore } from '../modules/auth/stores/userStore'
export default defineNuxtRouteMiddleware(async (to) => {
    const authPages = ['/auth/login', '/auth/register', '/auth']
    const isAuthPage = authPages.some((page) => to.path.startsWith(page))

    const userStore = useUserStore()
    const token = userStore.getAccessToken()

    const requiresAuth = to.meta.requiresAuth !== false

    let isAuthenticated = !!token

    // Attempt token refresh if no access_token exists
    if (!token) {
        try {
            const { $authService } = useNuxtApp()
            const response = await $authService.GetAccessToken()
            const access_token = response.data.access_token

            // Fetch user data
            const fetchUserFn = async () => {
                const userResponse = await $authService.getUserData()
                return userResponse.data
            }
            const userData = await fetchUserFn()

            // Use setAuth to properly set both token and user
            userStore.setAuth({
                access_token,
                user: userData,
            })
            isAuthenticated = true
        } catch (error) {
            userStore.logout() // logout handles both store and cookie
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
