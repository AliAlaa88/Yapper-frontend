import type { UserInfoService } from '../modules/profile/services'

declare module '#app' {
    interface NuxtApp {
        $userInfoService: UserInfoService
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $userInfoService: UserInfoService
    }
}
