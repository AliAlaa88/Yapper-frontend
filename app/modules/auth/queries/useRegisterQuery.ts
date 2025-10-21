import { useMutation } from '@tanstack/vue-query'
import { useNuxtApp } from "#app";
import type { RegisterPayload } from '../types/register';
export function useRegisterQuery() {
    const { $authService } = useNuxtApp();

    return useMutation({
        mutationKey: ['registerStep1'],
        mutationFn: (payload: RegisterPayload) => $authService.registerStep1(payload),
        retry: false,
    });
}