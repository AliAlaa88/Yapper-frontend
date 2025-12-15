import { useNuxtApp } from '#app'
import { useQuery } from '@tanstack/vue-query'
import { watch } from 'vue'

export function useGetUserQuery(
    enabled: Ref<boolean> | boolean = false,
    onSuccess?: (data: any) => void,
    onError?: (error: unknown) => void,
) {
    const { $authService } = useNuxtApp()

    const query = useQuery({
        queryKey: ['getUser'],
        queryFn: () => $authService.getUserData(),
        enabled: enabled,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })

    // Watch for data changes and call onSuccess
    if (onSuccess) {
        watch(
            () => query.data.value,
            (newData) => {
                if (newData) {
                    onSuccess(newData)
                }
            },
        )
    }

    // Watch for error changes and call onError
    if (onError) {
        watch(
            () => query.error.value,
            (newError) => {
                if (newError) {
                    onError(newError)
                }
            },
        )
    }

    return query
}
