import { userInfoServiceReal } from './userInfoService.real'
import { userInfoServiceMock } from './userInfoService.mock'
import { useRuntimeConfig } from '#app'

export const createUserInfoService = () => {
    const config = useRuntimeConfig()
    const isMock = config.public.mockApi.toString() === 'true'

    return isMock ? userInfoServiceMock : userInfoServiceReal
}
