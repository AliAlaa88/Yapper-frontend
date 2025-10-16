import { userInfoServiceReal } from './userInfoService.real'
import { userInfoServiceMock } from './userInfoService.mock'
// import { useRuntimeConfig } from 'nuxt/app'

// const config = useRuntimeConfig()
const isMock = true

console.log(isMock)

export const userInfoService = isMock ? userInfoServiceMock : userInfoServiceReal
export type UserInfoService = typeof userInfoService
