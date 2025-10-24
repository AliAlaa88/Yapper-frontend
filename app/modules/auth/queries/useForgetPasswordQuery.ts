import { useMutation } from '@tanstack/vue-query'
import { useNuxtApp } from "#app";

export function useForgotPasswordQuery() {
    const { $authService } = useNuxtApp();
    return useMutation({
        mutationKey: ['forgotPassword'],
        mutationFn: ({ identifier }: { identifier: string }) => $authService.forgotPassword(identifier),
        retry: false,
    });
}

export function useVerifyForgotPasswordOTPQuery() {
    const { $authService } = useNuxtApp();
    return useMutation({
        mutationKey: ['verifyForgotPasswordOTP'],
        mutationFn: ({identifier, token}: {identifier: string, token: string}) => $authService.verifyForgotPasswordOTP(identifier, token),
        retry: false,
    });
}

export function useResetPasswordQuery() {
    const { $authService } = useNuxtApp();
    return useMutation({
        mutationKey: ['resetPassword'],
        mutationFn: ({identifier, newPassword, reset_token}: {identifier: string, newPassword: string, reset_token: string}) => $authService.resetPassword(identifier, newPassword, reset_token),
        retry: false,
    });
}
