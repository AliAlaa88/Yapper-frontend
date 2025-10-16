// /modules/profile/services/index.ts
import { userInfoServiceReal } from './userInfoService.real'
import { userInfoServiceMock } from './userInfoService.mock'
import { useRuntimeConfig } from '#app'

export const createUserInfoService = () => {
    const config = useRuntimeConfig()
    const isMock = config.public.mockApi === true


    // console.log('[createUserInfoService] mock mode:', isMock)

    return isMock ? userInfoServiceMock : userInfoServiceReal
}
