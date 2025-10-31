import type { Me } from '../types/user'
import { useUserInfoQuery } from '../queries/useUserInfoQuery'
import { ref, computed, watch } from 'vue'

const me = ref<Me | null>(null)
const isInitialized = ref(false)

const initializeMe = () => {
    if (isInitialized.value) return

    const { myQuery } = useUserInfoQuery('')

    watch(
        () => myQuery.data.value,
        (newData) => {
            if (newData) {
                me.value = newData
            }
        },
        { immediate: true },
    )

    isInitialized.value = true
}

export const getMe = (): Me | null => {
    initializeMe()
    return me.value
}

export const updateMe = (updatedData: Partial<Me>): Me => {
    if (!me.value) {
        throw new Error('No user data available to update')
    }
    me.value = { ...me.value, ...updatedData }
    return me.value
}

export const setMe = (userData: Me): void => {
    me.value = userData
}

export const clearMe = (): void => {
    me.value = null
    isInitialized.value = false
}

export const isMe = (username: string): boolean => {
    initializeMe()
    return me.value?.username === username
}

export function useMe(username: string) {
    initializeMe()

    return {
        isMe: computed(() => me.value?.username === username),
        me: computed(() => me.value),
    }
}
