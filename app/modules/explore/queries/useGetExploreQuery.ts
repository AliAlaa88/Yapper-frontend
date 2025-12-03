import { useNuxtApp } from "#app";
import { useQuery } from "@tanstack/vue-query";
import { watch } from "vue";

export function useGetTrendsQuery(
    category: String,
    country: String,
    enabled: Ref<boolean> | boolean = false,
    onSuccess?: (data: any) => void,
    onError?: (error: unknown) => void
) {
    const { $exploreService } = useNuxtApp();
    
    const query= useQuery({
        queryKey: ['getTrends', category, country],
        queryFn: () => $exploreService.getTrending(category, country),
        enabled,
        retry: false,
    });
    // Watch for data changes and call onSuccess
    if (onSuccess) {
        watch(() => query.data.value, (newData) => {
            if (newData) {
                onSuccess(newData);
            }
        });
    }
    // Watch for error changes and call onError
    if (onError) {
        watch(() => query.error.value, (newError) => {
            if (newError) {
                onError(newError);
            }
        });
    }
    return query;
}