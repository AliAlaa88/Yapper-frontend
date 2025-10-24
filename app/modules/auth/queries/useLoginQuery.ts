import { useMutation } from '@tanstack/vue-query'
import { useNuxtApp } from "#app";

export function useLoginQuery() {
    const { $authService } = useNuxtApp();
    return useMutation({
        mutationKey: ['login'],
        mutationFn: ({Email,Password}: {Email: string, Password: string}) => $authService.login(Email,Password),
        retry: false,
    });
}