<template>
    <Popup
        :is-open="isOpen"
        data-test="popup"
        :has-close-button="false"
        content-class="max-w-lg sm:max-w-xl w-full"
        header-class="absolute top-4 left-4 z-10 bg-transparent p-0"
        slot-class="p-8 sm:p-10 md:p-14 lg:p-20"
    >
        <Logo
            img-class="relative z-10 w-8 lg:w-10 mb-3"
            div-class="flex justify-center mb-6"
        />

        <h2 class="text-3xl font-bold mb-3">{{ $t('settings.changeCountry.title') }}</h2>
        <p class="text-muted mb-9 text-xs">
            {{ $t('settings.changeCountry.description') }}
        </p>
        <div>
            <Button
                id="confirm-change-country-button"
                button-class="w-full flex-1 bg-alternate text-alternate py-3 rounded-full
                hover:bg-hover-alternate transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                :button-text="$t('settings.changeCountry.button')"
                @click="$emit('confirm')" />
            <Button
                id="cancel-change-country-button"
                button-class="w-full flex-1 bg-transparent text-primary underline py-3 rounded-full
                hover:bg-hover transition font-medium"
                :button-text="$t('settings.changeCountry.cancel')"
                @click="$emit('cancel')" />
        </div>
    </Popup>
</template>

<script setup lang="ts">
import Logo from '~/modules/Common/components/Logo'
import Popup from '~/modules/Common/components/Popup/Popup.vue'
import Button from '~/modules/Common/components/Button/Button.vue'

defineProps<{
    isOpen: boolean
    newCountry: string
}>()

defineEmits(['confirm', 'cancel'])

</script>
