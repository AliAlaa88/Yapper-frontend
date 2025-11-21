import { watch, onUnmounted } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import { useMeQuery } from '../queries/useMeQuery'
import { useOtherUserQuery } from '../queries/useOtherUserQuery'

export const useProfile = (username: string) => {
    const currentUser = (() => {
        if (typeof window === 'undefined') return undefined
        const raw = localStorage.getItem('currentUser') || localStorage.getItem('user')
        if (!raw) return undefined
        try {
            return JSON.parse(raw)
        } catch {
            return undefined
        }
    })()
    const isMyProfile = currentUser?.username === username
    const profileStore = useProfileStore()

    if (isMyProfile) {
        const meQuery = useMeQuery()

        const meWatcher = watch(
            () => meQuery.data.value,
            (newData) => {
                if (newData) {
                    profileStore.setProfile(newData, true)
                }
            },
            { immediate: true },
        )

        onUnmounted(() => {
            meWatcher()
            // profileStore.clearProfile()
        })

        return {
            profile: profileStore.profile,
            isMyProfile: profileStore.isMyProfile,
            isLoading: meQuery.isLoading,
        }
    } else {
        const userQuery = useOtherUserQuery(username)

        const userWatcher = watch(
            () => userQuery.data.value,
            (newData) => {
                if (newData) {
                    profileStore.setProfile(newData, false)
                }
            },
            { immediate: true },
        )

        onUnmounted(() => {
            userWatcher()
            // profileStore.clearProfile()
        })

        return {
            profile: profileStore.profile,
            isMyProfile: profileStore.isMyProfile,
            isLoading: userQuery.isLoading,
        }
    }
}
