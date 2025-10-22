import { useMutation } from '@tanstack/vue-query'
import { useNuxtApp } from "#app";
import type { RegisterPayload,verifyAccountPayload,finalizeRegisterPayload } from '../types/register';
const { $authService } = useNuxtApp();

export function useRegisterS1Query() {
    return useMutation({
        mutationKey: ['registerStep1'],
        mutationFn: (payload: RegisterPayload) => $authService.registerStep1(payload),
        retry: false,
    });
}

export function useRegisterS2Query(){
    return useMutation({
        mutationKey: ['registerStep2'],
        mutationFn: (payload: verifyAccountPayload) => $authService.registerStep2(payload),
        retry: false,
    });
}

export function useRegisterS3Query(){
    return useMutation({
        mutationKey: ['registerStep3'],
        mutationFn: (payload: finalizeRegisterPayload) => $authService.registerStep3(payload),
        retry: false,
    });
}

export function useResendOTPQuery(){
    return useMutation({
        mutationKey: ['resendOTP'],
        mutationFn: (email: string) => $authService.resendOTP(email),
        retry: false,
    });
}