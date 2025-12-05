<template>
    <div
        v-if="showList"
        ref="dropdownRef"
        class="sm:absolute right-0 mt-2 bg-primary rounded-xl fixed bottom-0 sm:bottom-auto
            sm:shadow-[0_0_7px_rgba(255,255,255,0.4)] shadow-none z-50 transition-all duration-200
            sm:w-70 sm:-top-2 left-1/2 sm:left-auto transform sm:transform-none -translate-x-1/2
            sm:translate-x-0 w-full sm:rounded-xl rounded-t-2xl sm:max-h-none max-h-[50vh]
            overflow-y-auto"
        @click.stop
    >
        <Button
            id="edit-tweet-button"
            button-class="cursor-pointer w-full text-primary font-semibold text-left
                px-4 py-3 hover:bg-hover transition flex items-center first:rounded-t-xl"
            @click="handleEdit"
        >
            <template #icon-left>
                <Edit2 class="w-4 h-4 mr-3" />
            </template>
            {{ $t('tweets.editTweet') }}
        </Button>

        <Button
            id="delete-tweet-button"
            button-class="w-full text-primary text-left px-4 py-3 font-semibold
                hover:bg-hover transition flex items-center last:rounded-b-xl cursor-pointer"
            @click="handleDelete"
        >
            <template #icon-left>
                <Trash2 class="w-4 h-4 mr-3" />
            </template>
            {{ $t('tweets.deleteTweet') }}
        </Button>

        <div class="px-4">
            <Button
                id="cancel-menu-button"
                button-class="w-full cursor-pointer border border-primary text-center
                    font-semibold py-2.5 hover:bg-hover rounded-full transition mt-2 mb-3
                    text-primary sm:hidden"
                @click="showList = false"
            >
                {{ $t('profile.cancelButton') }}
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, type Ref } from 'vue'
import Button from '~/modules/Common/components/Button/Button.vue'
import { Edit2, Trash2 } from 'lucide-vue-next'
import { onMounted, onBeforeUnmount } from 'vue'

defineProps<{
    tweetId: string
}>()

const emit = defineEmits<{
    edit: []
    delete: []
}>()

const showList = inject<Ref<boolean>>('show-list')!
const dropdownRef = ref<HTMLElement | null>(null)

function handleEdit() {
    emit('edit')
}
function handleDelete() {
    emit('delete')
}

function handleClickOutside(event: MouseEvent) {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        showList.value = false
    }
}


onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>
