import { useUserInfo } from './useUserInfo'
export function useFollow(userId: Ref<string | undefined>) {
    const { isFollower, isFollowing, username } = useUserInfo(userId)
    const hover = ref(false)

    function handleMouseOver() {
        if (isFollowing.value) hover.value = true
    }

    function handleMouseOut() {
        if (isFollowing.value) hover.value = false
    }

    const buttonText = computed(() => {
        if (isFollower.value && !isFollowing.value) return 'Follow back'
        else if (!isFollower.value && !isFollowing.value) return 'Follow'
        else if (isFollowing.value && !hover.value) return 'Following'
        else if (isFollowing.value && hover.value) return 'Unfollow'
        else return 'undefined'
    })

    const buttonClass = computed(() => {
        if (!isFollowing.value) {
            if (!isFollower.value)
                return 'bg-[#F7F9F9] text-[#15202B] border border-transparent px-[53px] py-[10px] w-[88px] h-[36px] hover:bg-[#E1E8ED]'
            else
                return 'bg-[#F7F9F9] text-[#15202B] border border-transparent px-[57px] py-[10px] w-[88px] h-[36px] hover:bg-[#E1E8ED]'
        } else {
            return hover.value
                ? 'bg-red-500/10 border-[0.1px] border-red-500/40 text-red-500 px-[53px] py-[10px] w-[88px] h-[36px]'
                : 'bg-transparent border-[0.1px] border-white/40 text-white px-[53px] py-[10px] w-[88px] h-[36px]'
        }
    })

    return {
        buttonClass,
        buttonText,
        handleMouseOut,
        handleMouseOver,
        username,
    }
}
