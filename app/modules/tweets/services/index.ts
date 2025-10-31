// /modules/tweets/services/index.ts
import { tweetServiceReal } from './tweetService.real'
import { tweetServiceMock } from './tweetService.mock'
import { useRuntimeConfig } from '#app'

export const createTweetService = () => {
    const config = useRuntimeConfig()
    const mockApi = config.public.mockApi
    const isMock = mockApi === 'true' || (mockApi as any) === true

    // console.log('[createTweetService] mock mode:', isMock)

    return isMock ? tweetServiceMock : tweetServiceReal
}