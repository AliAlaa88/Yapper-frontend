import { useUserInfo } from './useUserInfo'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useFollow(userId: Ref<string | undefined>) {
    const { isFollower, isFollowing} = useUserInfo(userId)
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
            if (!isFollower.value)
                return 'bg-alternate text-alternate border border-transparent px-[53px] py-[10px] w-[88px] h-[36px] hover:opacity-90'
            else
                return 'bg-alternate text-alternate border border-transparent px-[57px] py-[10px] w-[88px] h-[36px] hover:opacity-90'
        } else {
            return hover.value
                ? 'bg-red/10 border border-red text-red px-[53px] py-[10px] w-[88px] h-[36px]'
                : 'bg-transparent border border-primary text-primary px-[53px] py-[10px] w-[88px] h-[36px]'
        }
    })

    return {
        buttonClass,
        buttonText,
        handleMouseOut,
        handleMouseOver,
    }
}
