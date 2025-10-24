<template>
  <div class="fixed inset-0 flex items-center justify-center z-50 bg-white/10 backdrop-blur-sm">
    <div class="bg-black text-white rounded-2xl w-full max-w-lg sm:max-w-xl p-30 relative flex flex-col justify-center">
      <button
        class="absolute top-4 left-4 w-10 h-10 text-gray-400 hover:text-white"
        @click="$emit('close')"
      >
        <i class="fas fa-arrow-left"></i>
      </button>

      <!-- Logo -->
       <logo imgClass="relative z-10 w-8 lg:w-10 mb-6" div-class="flex justify-center mb-6" />

      <!-- Title -->
      <h2 class="text-3xl font-bold text-left mb-6">We sent you a code</h2>
        <p class="text-gray-400 mb-6">
            Please enter the 6-digit code sent to your email address.
        </p>

        <!-- OTP Input -->
        <input
            type="text"
            placeholder="Enter OTP"
            v-model="otp"
            class="w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:border-gray-300 mb-4"
        />

      <!-- Next Button -->
      <button
        class="w-full bg-white text-black font-semibold rounded-full py-2 hover:bg-gray-200 transition mb-3"
        @click="onNext"
      >
        Next
      </button>

      <p class="text-center text-gray-400 text-sm">
        Didn’t receive the code?
        <button class="text-blue-400 hover:underline" @click="onResendCode">Resend code</button>
      </p>
      <div class="mt-4">
        <p v-if="resendCodeSuccess" class="text-green-400 text-sm text-center">{{ resendCodeSuccess }}</p>
        <p v-if="resendCodeFailure" class="text-red-400 text-sm text-center">{{ resendCodeFailure }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRegisterS2Query, useResendOTPQuery } from "../../../queries/useRegisterQuery";

const otp = ref("");

const registerMutation= useRegisterS2Query();
const resendOTPMutation= useResendOTPQuery();
const resendCodeSuccess=ref('');
const resendCodeFailure=ref('');

const props=defineProps<{
  Email: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'next', recommendations: string[]): void;
}>();

const onNext = () => {
  console.log("Next clicked:", otp.value);
    registerMutation.mutate({token:otp.value,Email:props.Email},{
      onSuccess:(Data)=>{
        console.log("Registration Step 2 Success:",Data);
        // Safely extract recommendations from various possible shapes
        const rec = (Data as any)?.data?.recommendations ?? (Data as any)?.recommendations ?? (Data as any)?.result?.recommendations ?? [];
        const recommendations = Array.isArray(rec) ? rec : [];
        emit('next', recommendations);
      },
      onError:(error)=>{
        console.error("Registration Step 2 Error:",error);
      }
    });
};

const onResendCode = () => {
  console.log("Resend code clicked");
    resendOTPMutation.mutate(props.Email,{
      onSuccess:(data)=>{
        console.log("Resend OTP Success:",data);
        resendCodeSuccess.value="OTP has been resent successfully.";
        resendCodeFailure.value="";
      },
      onError:(error)=>{
        console.error("Resend OTP Error:",error.message);
        resendCodeFailure.value= (error as any).response?.data?.message || error.message;
        resendCodeSuccess.value="";
      }
    });
};

</script>