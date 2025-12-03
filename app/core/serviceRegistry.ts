import { createUserInfoService } from '../modules/profile/services'
import { createTweetService } from '../modules/tweets/services'
import { createAuthService } from '../modules/auth/services'
import { createMediaService } from '../modules/Common/services'
import { createTimelineService } from '../modules/TimeLine/services'
import { settingsService } from '~/modules/settings/services/settingsService.real'
import { createChatService } from '../modules/chat/services'
import { createSocketService } from '../modules/Common/services'

export const serviceFactories = {
    userInfoService: createUserInfoService,
    tweetService: createTweetService,
    authService: createAuthService,
    mediaService: createMediaService,
    timelineService: createTimelineService,
    settingsService: () => settingsService,
    chatService: createChatService,
    socketService: createSocketService,
}

export type Services = {
    [K in keyof typeof serviceFactories]: ReturnType<(typeof serviceFactories)[K]>
}
