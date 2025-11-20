import { useMutation } from '@tanstack/vue-query'
import { useNuxtApp } from '#app'
import { useUserStore } from '../stores/userStore'
export function useLoginQuery(onSuccess?: (data: any) => void, onError?: (error: unknown) => void) {
    const { $authService } = useNuxtApp()
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
        onSuccess: (data) => onSuccess?.(data),
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
    const { $authService } = useNuxtApp()
    const userStore = useUserStore()
    return useMutation({
        mutationKey: ['logout'],
        mutationFn: () => $authService.logout(),
        retry: false,
        onSuccess: (data) => {
            onSuccess?.(data)
            userStore.logout()
        },
        onError: (error) => onError?.(error),
    })
}
