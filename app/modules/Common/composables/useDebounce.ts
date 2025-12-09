import { ref, watch, onBeforeUnmount } from 'vue'

export const useDebounce = (value: Ref<string> | string, delay: number): Ref<string> => {
    const initialValue = typeof value === 'string' ? value : value.value
    const debouncedValue = ref(initialValue)
    let timeout: ReturnType<typeof setTimeout> | null = null

    watch(
        () => (typeof value === 'string' ? value : value.value),
        (newValue) => {
            if (timeout) clearTimeout(timeout)

            timeout = setTimeout(() => {
                debouncedValue.value = newValue
            }, delay)
        },
    )

    onBeforeUnmount(() => {
        if (timeout) clearTimeout(timeout)
    })

    return debouncedValue
}
