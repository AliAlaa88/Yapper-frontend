import { RecaptchaV2, install as RecaptchaInstall } from 'vue3-recaptcha-v2'
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'
import { useNuxtApp } from '#app'

export default defineNuxtPlugin(() => {
    const nuxtApp = useNuxtApp()
    // Provide options to the library (required to avoid destructuring undefined)
    const config = useRuntimeConfig()
    nuxtApp.vueApp.use(RecaptchaInstall, { sitekey: config.public.recaptcha })

    // Register the component globally: <RecaptchaV2 />
    nuxtApp.vueApp.component('RecaptchaV2', RecaptchaV2 as any)
})
