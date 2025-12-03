import { useNuxtApp } from "#app";
export const exploreServiceReal = () => {
    const { $yapperApi } = useNuxtApp();
    const config = useRuntimeConfig();
    const API_URL = config.public.apiUrl;
    return {
        getExplore: async () => {
            const response = await $yapperApi.get(`${API_URL}/explore`);   
            return response.data;
        },
        getTrending: async (category: String, country: String) => {
            const response = await $yapperApi.get(`${API_URL}/explore/trending`, {params: {category, country}});   
            return response.data;
        },
        getExploreForYou: async (category: String) => {
            const response = await $yapperApi.get(`${API_URL}/explore/for-you`, {params: {category}});   
            return response.data;
        },
        getExploreWhoToFollow: async () => {
            const response = await $yapperApi.get(`${API_URL}/explore/who-to-follow`);   
            return response.data;
        },
    }
}