export function isLoggedIn(): boolean {
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('access_token')
    if (user && token) {
        return true
    }
    return false
}
