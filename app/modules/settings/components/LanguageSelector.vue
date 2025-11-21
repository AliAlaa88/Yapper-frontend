<template>
    <Popup
        :is-open="isOpen"
        @close="handleClose">
        <h2 class="text-4xl font-bold px-12 mb-2 mt-7">
            {{ t('settings.languages.selectAppLanguage') }}
        </h2>
        <p class="text-muted text-sm px-12">
            {{ t('settings.languages.selectAppLanguage_desc') }}
        </p>

        <div class="mt-8 px-12 space-y-4">
            <button
                class="w-full flex justify-between items-center
                px-1 py-2 text-primary rounded"
                @click="selected = 'en'">
                <div class="font-semibold">
                    English – English
                </div>
                <CheckCircle2 v-if="selected === 'en'" class="text-accent" :size="20" />
                <Circle v-else class="opacity-40" :size="20" />
            </button>

            <button
                class="w-full flex justify-between items-center
                px-1 py-2 text-primary rounded"
                @click="selected = 'ar'"
            >
                <div class="font-semibold">
                    Arabic – العربية
                </div>
                <CheckCircle2 v-if="selected === 'ar'" class="text-accent" :size="20" />
                <Circle v-else class="opacity-40" :size="20" />
            </button>
            <Button
                button-class="w-full cursor-pointer bg-alternate text-alternate
                font-semibold mt-60 mb-4 py-3 rounded-full"
                :is-loading="useChangeLanguage.isPending.value"
                @click="handleConfirm"
            >
                {{ $t('settings.languages.next') }}
            </Button>
        </div>

    </Popup>
</template>

<script setup lang="ts">
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import { Circle, CheckCircle2 } from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import { userSettingsQueries } from '../queries/userSettingsQueries'
import type { User } from '~/modules/Common/types/user'
import { getUser } from '~/utils/helpers'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const user = getUser() as User
const { useChangeLanguage } = userSettingsQueries()
const selected = ref<'en' | 'ar'>(user.language as 'en' | 'ar' || 'en')

const props = defineProps<{
    isOpen: boolean
    handleClose: () => void
}>()

const handleConfirm = () => {
    console.log('Selected:', selected.value)
    props.handleClose()
    useChangeLanguage.mutate({ language: selected.value })
}
</script>
