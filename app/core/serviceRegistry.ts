import { createUserInfoService } from '../modules/profile/services'
import { createTweetService } from '../modules/tweets/services'
import { createAuthService } from '../modules/auth/services'
import { createMediaService } from '../modules/Common/services'
import { createTimelineService } from '../modules/TimeLine/services'
import { createSearchService } from '../modules/search/services'
import { settingsService } from '~/modules/settings/services/settingsService'
import { listService } from '~/modules/Common/services/listService'


export const serviceFactories = {
    userInfoService: createUserInfoService,
    tweetService: createTweetService,
    authService: createAuthService,
    mediaService: createMediaService,
    timelineService: createTimelineService,
    settingsService: () => settingsService,
    searchService: createSearchService,
    listService: () => listService,
}

export type Services = {
    [K in keyof typeof serviceFactories]: ReturnType<(typeof serviceFactories)[K]>
}
