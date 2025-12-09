import { useNuxtApp } from '#app'
export const exploreServiceReal = () => {
    const { $yapperApi } = useNuxtApp()
    const config = useRuntimeConfig()
    const API_URL = config.public.apiUrl
    return {
        getExplore: async () => {
            const response = await $yapperApi.get(`${API_URL}/explore`)
            return response.data
        },
        getTrending: async (category?: String, limit?: number) => {
            const params = category ? { category } : {}
            const response = await $yapperApi.get(`${API_URL}/trend`, {
                params: { ...params, limit },
            })
            return response.data.data.data
        },
        getExploreCategories: async (category?: String) => {
            const params = category ? { category } : {}
            const response = await $yapperApi.get(`${API_URL}/explore/for-you`, { params })
            return response.data
        },
        getExploreWhoToFollow: async () => {
            const response = await $yapperApi.get(`${API_URL}/explore/who-to-follow`)
            return response.data
        },
    }
}
