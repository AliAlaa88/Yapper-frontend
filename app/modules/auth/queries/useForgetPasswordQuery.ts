import { useMutation } from '@tanstack/vue-query'
import { useNuxtApp } from "#app";

export function useForgotPasswordQuery(
    onSuccess?: (data: any) => void,
    onError?: (error: unknown) => void
) {
    const { $authService } = useNuxtApp();
    return useMutation({
        mutationKey: ['forgotPassword'],
        mutationFn: ({ identifier }: { identifier: string }) => $authService.forgotPassword(identifier),
        retry: false,
        onSuccess: (data) => onSuccess?.(data),
        onError: (error) => onError?.(error),
    });
}

export function useVerifyForgotPasswordOTPQuery(
    onSuccess?: (data: any) => void,
    onError?: (error: unknown) => void
) {
    const { $authService } = useNuxtApp();
    return useMutation({
        mutationKey: ['verifyForgotPasswordOTP'],
        mutationFn: ({identifier, token}: {identifier: string, token: string}) => $authService.verifyForgotPasswordOTP(identifier, token),
        retry: false,
        onSuccess: (data) => onSuccess?.(data),
        onError: (error) => onError?.(error),
    });
}

export function useResetPasswordQuery(
    onSuccess?: (data: any) => void,
    onError?: (error: unknown) => void
) {
    const { $authService } = useNuxtApp();
    return useMutation({
        mutationKey: ['resetPassword'],
        mutationFn: ({identifier, newPassword, reset_token}: {identifier: string, newPassword: string, reset_token: string}) => $authService.resetPassword(identifier, newPassword, reset_token),
        retry: false,
        onSuccess: (data) => onSuccess?.(data),
        onError: (error) => onError?.(error),
    });
}
