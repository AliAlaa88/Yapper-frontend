import { searchServiceReal } from './searchService.real'
import { searchServiceMock } from './searchService.mock'
import { useRuntimeConfig } from '#app'

export const createSearchService = () => {
    const config = useRuntimeConfig()
    // const isMock = config.public.mockApi.toString() === 'true'
    const isMock = true

    return isMock ? searchServiceMock : searchServiceReal
}
