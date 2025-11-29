import { watch, onUnmounted } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import { useMeQuery } from '../queries/useMeQuery'
import { useOtherUserQuery } from '../queries/useOtherUserQuery'
import { useUserStore } from '~/modules/auth/stores/userStore'
export const useProfile = (username: string) => {
    const userStore = useUserStore()

    const currentUser = (() => {
        if (typeof window === 'undefined') return undefined
        const raw = userStore.getUser()
        if (!raw) return undefined
        return raw
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
            error: meQuery.error,
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
            error: userQuery.error,
        }
    }
}
