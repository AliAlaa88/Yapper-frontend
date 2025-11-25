import { createUserInfoService } from '../modules/profile/services'
import { createTweetService } from '../modules/tweets/services'
import { createAuthService } from '../modules/auth/services'
import { createMediaService } from '../modules/Common/services'
import { createTimelineService } from '../modules/TimeLine/services'
import { settingsService } from '~/modules/settings/services/settingsService.real'
import { chatService } from '../modules/chat/services'

export const serviceFactories = {
    userInfoService: createUserInfoService,
    tweetService: createTweetService,
    authService: createAuthService,
    mediaService: createMediaService,
    timelineService: createTimelineService,
    settingsService: () => settingsService,
    chatService: () => chatService,
}

export type Services = {
    [K in keyof typeof serviceFactories]: ReturnType<(typeof serviceFactories)[K]>
}
