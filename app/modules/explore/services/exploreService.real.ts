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
        getExploreCategories: async (category_id: string, page: number = 1, limit: number = 20) => {
            const response = await $yapperApi.get(`${API_URL}/explore/category/${category_id}`, {
                params: { page, limit },
            })
            return response.data
        },
        getExploreWhoToFollow: async () => {
            const response = await $yapperApi.get(`${API_URL}/explore/who-to-follow`)
            return response.data
        },
    }
}
