import { useMutation } from "@tanstack/vue-query";
import { useNuxtApp } from "#app";

export function useOAuthCompleteStep1Query(
    onSuccess?: (data: any) => void,
    onError?: (error: unknown) => void
) {
    const { $authService } = useNuxtApp();

    return useMutation({
        mutationFn: (variables: { OAuth_session_token: string; Birth_date: string }) =>
            $authService.OAuthCompleteStep1(variables.OAuth_session_token, variables.Birth_date),
        onSuccess,
        onError
    });
}
export function useOAuthCompleteStep2Query(
    onSuccess?: (data: any) => void,
    onError?: (error: unknown) => void
) {
    const { $authService } = useNuxtApp();

    return useMutation({
        mutationFn: (variables: { OAuth_session_token: string; Username: string }) =>
            $authService.OAuthCompleteStep2(variables.OAuth_session_token, variables.Username),
        onSuccess,
        onError
    });
}