import { ref, watch, onUnmounted, type Ref } from 'vue'

export interface UseInfiniteScrollOptions {
    hasNextPage: Ref<boolean>
    isFetchingNextPage: Ref<boolean>
    fetchNextPage: () => void
    observerOptions?: IntersectionObserverInit
}

export function useInfiniteScroll(options: UseInfiniteScrollOptions) {
    const { hasNextPage, isFetchingNextPage, fetchNextPage, observerOptions } = options

    const loadMoreTrigger = ref<HTMLElement | null>(null)
    let observer: IntersectionObserver | null = null

    const defaultObserverOptions: IntersectionObserverInit = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
        ...observerOptions,
    }

    const cleanup = () => {
        if (observer) {
            observer.disconnect()
            observer = null
        }
    }

    watch(
        () => loadMoreTrigger.value,
        (el) => {
            cleanup()

            if (!el) return

            observer = new IntersectionObserver((entries) => {
                const entry = entries[0]
                if (entry?.isIntersecting && hasNextPage.value && !isFetchingNextPage.value) {
                    fetchNextPage()
                }
            }, defaultObserverOptions)

            observer.observe(el)
        },
        { immediate: true },
    )

    onUnmounted(cleanup)

    return {
        loadMoreTrigger,
    }
}
