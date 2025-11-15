// /modules/tweets/services/index.ts
import { tweetServiceReal } from './tweetService.real'
import { tweetServiceMock } from './tweetService.mock'
import { useRuntimeConfig } from '#app'

export const createTweetService = () => {
    const config = useRuntimeConfig()
    const isMock = config.public.mockApi.toString() === 'true'

    return isMock ? tweetServiceMock : tweetServiceReal
}
