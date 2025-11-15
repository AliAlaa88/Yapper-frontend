export default defineNuxtRouteMiddleware((to) => {
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('access_token')
    const isAuthenticated = !!(user && token)

    // Check if route requires authentication
    const requiresAuth = to.meta.requiresAuth !== false

    if (requiresAuth && !isAuthenticated) {
        // Redirect to auth if trying to access protected route without authentication
        return navigateTo('/auth')
    }

    if (!requiresAuth && isAuthenticated) {
        // Redirect to home if trying to access auth pages while already authenticated
        return navigateTo('/')
    }
})
