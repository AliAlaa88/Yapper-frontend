import { useUserInfo } from './useUserInfo'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useFollow(userId: Ref<string | undefined>, enabled: Ref<boolean> = ref(true)) {
    const { isFollower, isFollowing } = useUserInfo(userId, enabled)
    const hover = ref(false)
    const { t } = useI18n()

    function handleMouseOver() {
        if (isFollowing.value) hover.value = true
    }

    function handleMouseOut() {
        if (isFollowing.value) hover.value = false
    }

    const buttonText = computed(() => {
        if (isFollower.value && !isFollowing.value) return t('profile.followBackButton')
        else if (!isFollower.value && !isFollowing.value) return t('profile.followButton')
        else if (isFollowing.value && !hover.value) return t('profile.followingButton')
        else if (isFollowing.value && hover.value) return t('profile.unfollowButton')
        else return 'undefined'
    })

    const buttonClass = computed(() => {
        if (!isFollowing.value) {
            // Follow or Follow Back button
            return 'bg-[#eff3f4] text-[#0f1419] border border-transparent px-4 py-1.5 h-9 min-w-[36px] hover:bg-[#d7dbdc]'
        } else {
            // Following/Unfollow button
            return hover.value
                ? 'bg-[#f4212e1a] border border-[#67070f] text-[#f4212e] px-4 py-1.5 h-9 min-w-[109px] hover:bg-[#f4212e1a]'
                : 'bg-transparent border border-[#536471] text-primary px-4 py-1.5 h-9 min-w-[109px] hover:bg-[#181818]'
        }
    })

    return {
        buttonClass,
        buttonText,
        handleMouseOut,
        handleMouseOver,
    }
}
