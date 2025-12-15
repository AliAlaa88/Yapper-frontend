import { createUserInfoService } from '../modules/profile/services'
import { createTweetService } from '../modules/tweets/services'
import { createAuthService } from '../modules/auth/services'
import { createMediaService } from '../modules/Common/services'
import { createTimelineService } from '../modules/TimeLine/services'
import { createSearchService } from '../modules/search/services'
import { exploreService } from "~/modules/explore/services";
import { settingsService } from '~/modules/settings/services/settingsService'
import { listService } from '~/modules/Common/services/listService'

import { createChatService } from '../modules/chat/services'
import { createNotificationsService } from '~/modules/notifications/services/notificationsService'

export const serviceFactories = {
    userInfoService: createUserInfoService,
    tweetService: createTweetService,
    authService: createAuthService,
    mediaService: createMediaService,
    timelineService: createTimelineService,
    settingsService: () => settingsService,
    searchService: createSearchService,
    exploreService: exploreService,
    chatService: createChatService,
    listService: () => listService,
    notificationsService : createNotificationsService,
}

export type Services = {
    [K in keyof typeof serviceFactories]: ReturnType<(typeof serviceFactories)[K]>
}
