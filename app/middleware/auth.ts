export default defineNuxtRouteMiddleware(async (to) => {
    const token = useCookie('access_token').value

    // Check if route requires authentication
    const requiresAuth = to.meta.requiresAuth !== false

    // Use token from cookie as the source of truth for auth state
    const isAuthenticated = !!token

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
