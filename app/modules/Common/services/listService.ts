
export const listService = {
    async fetchList(path: string, nextCursor: string): Promise<any> {
        const { $axios } = useNuxtApp()

        const separator = path.includes('?') ? '&' : '?'
        const response = await $axios.get(
            `${path}` + (nextCursor ? `${separator}cursor=${nextCursor}` : '')
        )
        const page = response.data.data

        return {
            data: page.data,
            nextCursor: page.pagination.next_cursor,
            hasMore: page.pagination.has_more,
        }
    },
}
