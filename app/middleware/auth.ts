import { useNuxtApp } from '#app'

export default defineNuxtRouteMiddleware(async (to) => {
    const { $authService } = useNuxtApp()

    const user = localStorage.getItem('user')
    let token = useCookie('access_token').value
    const isAuthenticated = !!(user && token)
    // Check if route requires authentication
    const requiresAuth = to.meta.requiresAuth !== false

    if (requiresAuth && !isAuthenticated) {
        // Redirect to auth if trying to access protected route without authentication
        window.document.title = 'login'
        return navigateTo('/auth')
    }

    if (!requiresAuth && isAuthenticated) {
        // Redirect to home if trying to access auth pages while already authenticated
        return navigateTo('/')
    }
})
