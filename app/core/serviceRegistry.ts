// /core/serviceRegistry.ts
import { createUserInfoService } from '../modules/profile/services'
import { createTweetService } from '../modules/tweets/services'
// import { createAuthService } from '../modules/auth/services'

export const serviceFactories = {
    userInfoService: createUserInfoService,
    tweetService: createTweetService,
    // authService: createAuthService,
}

export type Services = {
    [K in keyof typeof serviceFactories]: ReturnType<(typeof serviceFactories)[K]>
}
