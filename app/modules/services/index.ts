// /modules/profile/services/index.ts

import { useRuntimeConfig } from '#app'

export const createUserInfoService = () => {
    const config = useRuntimeConfig()
    const isMock = config.public.mockApi == true

    window.alert(config.public.mockApi)

    return isMock ? true : false
}
