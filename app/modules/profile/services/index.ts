import { userInfoServiceReal } from './userInfoService.real'
import { userInfoServiceMock } from './userInfoService.mock'

const isMock = process.env.NUXT_PUBLIC_MOCK_API === 'true'
console.log(isMock)

export const userInfoService = isMock ? userInfoServiceMock : userInfoServiceReal
export type UserInfoService = typeof userInfoService
