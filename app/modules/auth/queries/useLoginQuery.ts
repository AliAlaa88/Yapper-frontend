import { useMutation } from '@tanstack/vue-query'
import { useNuxtApp } from "#app";

export function useLoginQuery() {
    const { $authService } = useNuxtApp();
    return useMutation({
        mutationKey: ['login'],
        mutationFn: ({identifier, Password, Type}: {identifier: string, Password: string, Type: string}) => $authService.login(identifier, Password, Type),
        retry: false,
    });
}

export function useCheckIdentifierAvailabilityQuery() {
    const { $authService } = useNuxtApp();
    return useMutation({
        mutationKey: ['checkIdentifierAvailability'],
        mutationFn: (identifier: string) => $authService.checkIdentifierAvailability(identifier),
        retry: false,
    });
}