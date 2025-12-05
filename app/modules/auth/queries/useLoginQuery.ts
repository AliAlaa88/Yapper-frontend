import { useMutation } from '@tanstack/vue-query'
import { useNuxtApp } from '#app'
import { useUserStore } from '../stores/userStore'
import { cacheInvalidation } from '~/modules/Common/queries/cacheInvalidation'

export function useLoginQuery(onSuccess?: (data: any) => void, onError?: (error: unknown) => void) {
    const { $authService, $queryClient } = useNuxtApp()
    return useMutation({
        mutationKey: ['login'],
        mutationFn: ({
            identifier,
            Password,
            Type,
        }: {
            identifier: string
            Password: string
            Type: string
        }) => $authService.login(identifier, Password, Type),
        retry: false,
        onSuccess: (data) => {
            cacheInvalidation.onLogin($queryClient)
            onSuccess?.(data)
        },
        onError: (error) => onError?.(error),
    })
}

export function useCheckIdentifierAvailabilityQuery(
    onSuccess?: (data: any) => void,
    onError?: (error: unknown) => void,
) {
    const { $authService } = useNuxtApp()
    return useMutation({
        mutationKey: ['checkIdentifierAvailability'],
        mutationFn: (identifier: string) => $authService.checkIdentifierAvailability(identifier),
        retry: false,
        onSuccess: (data) => onSuccess?.(data),
        onError: (error) => onError?.(error),
    })
}

export function useLogoutQuery(
    onSuccess?: (data: any) => void,
    onError?: (error: unknown) => void,
) {
    const { $authService, $queryClient } = useNuxtApp()
    const userStore = useUserStore()
    return useMutation({
        mutationKey: ['logout'],
        mutationFn: () => $authService.logout(),
        retry: false,
        onSuccess: (data) => {
            // Clear all cached data on logout
            cacheInvalidation.onLogout($queryClient)
            onSuccess?.(data)
            userStore.logout()
            window.location.href = '/auth'
        },
        onError: (error) => onError?.(error),
    })
}
