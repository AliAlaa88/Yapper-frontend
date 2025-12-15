import { useMutation } from '@tanstack/vue-query'
import { useNuxtApp } from '#app'
import type {
    RegisterPayload,
    verifyAccountPayload,
    finalizeRegisterPayload,
} from '../types/register'

export function checkIdentifier(
    onSuccess?: (data: any) => void,
    onError?: (error: unknown) => void,
) {
    const { $authService } = useNuxtApp()
    return useMutation({
        mutationKey: ['checkIdentifier'],
        mutationFn: (identifier: string) => $authService.checkIdentifierAvailability(identifier),
        retry: false,
        onSuccess: (data) => onSuccess?.(data),
        onError: (error) => onError?.(error),
    })
}

export function useRegisterS1Query(
    onSuccess?: (data: any) => void,
    onError?: (error: unknown) => void,
) {
    const { $authService } = useNuxtApp()
    return useMutation({
        mutationKey: ['registerStep1'],
        mutationFn: (payload: RegisterPayload) => $authService.registerStep1(payload),
        retry: false,
        onSuccess: (data) => onSuccess?.(data),
        onError: (error) => onError?.(error),
    })
}

export function useRegisterS2Query(
    onSuccess?: (data: any) => void,
    onError?: (error: unknown) => void,
) {
    const { $authService } = useNuxtApp()
    return useMutation({
        mutationKey: ['registerStep2'],
        mutationFn: (payload: verifyAccountPayload) => $authService.registerStep2(payload),
        retry: false,
        onSuccess: (data) => onSuccess?.(data),
        onError: (error) => onError?.(error),
    })
}

export function useRegisterS3Query(
    onSuccess?: (data: any) => void,
    onError?: (error: unknown) => void,
) {
    const { $authService } = useNuxtApp()
    return useMutation({
        mutationKey: ['registerStep3'],
        mutationFn: (payload: finalizeRegisterPayload) => $authService.registerStep3(payload),
        retry: false,
        onSuccess: (data) => onSuccess?.(data),
        onError: (error) => onError?.(error),
    })
}

export function useResendOTPQuery(
    onSuccess?: (data: any) => void,
    onError?: (error: unknown) => void,
) {
    const { $authService } = useNuxtApp()
    return useMutation({
        mutationKey: ['resendOTP'],
        mutationFn: (email: string) => $authService.resendOTP(email),
        retry: false,
        onSuccess: (data) => onSuccess?.(data),
        onError: (error) => onError?.(error),
    })
}
