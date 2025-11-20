import { useNuxtApp } from "#app"
import Cookies from "js-cookie";
export default defineNuxtRouteMiddleware(async (to) => {
    const { $authService } = useNuxtApp()
    // Check authentication status using service --> bad practice to have async middleware
    // const response = await $authService.getUserData();
    const user = localStorage.getItem('user')
    const token = useCookie('access_token').value
    //console.log("Middleware auth check:", { user, token, response });
    const isAuthenticated = !!(user && token) //|| (response && response.data);
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
