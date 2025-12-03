<template>
    <DetailedPanel title="Change Country">
        <div class="mx-4 mt-9 relative">
            <select
                v-model="country"
                class="custom-select peer w-full pt-7 pb-3 px-4 border border-primary rounded-md bg-transparent
                focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
                @change="onSelectCountry">
                <option
                    v-for="count in countries"
                    :key="count"
                    :value="count"
                    class="bg-primary">
                    {{ count }}
                </option>
            </select>
            <label
                class="peer-focus:text-accent absolute start-3 top-1 text-xs text-muted
                        pointer-events-none px-1 py-1">Country</label>
            <ChevronDown
                :size="25"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-muted peer-focus:text-accent pointer-events-none" />
        </div>
    </DetailedPanel>
    <ConfirmChangeCountry
        v-if="showModal"
        :is-open="showModal"
        :new-country="selectedCountry"
        @confirm="updateCountry"
        @cancel="cancelChange" />
</template>

<script setup lang="ts">
import { countries } from '../../utils/countries'
import DetailedPanel from '../DetailedPanel.vue'
import { useUserStore } from '~/modules/auth/stores/userStore'
import { storeToRefs } from 'pinia'
import ConfirmChangeCountry from './SubComponents/ConfirmChangeCountry.vue'
import { useEditProfileMutation } from '~/modules/profile/queries/useEditProfileQuery'
import { ChevronDown } from 'lucide-vue-next'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const country = ref(user.value?.country)

const selectedCountry = ref('')
const showModal = ref(false)
const { editProfileMutation } = useEditProfileMutation(user.value?.id ?? '', user.value?.username ?? '')
const updateCountry = async () => {
    showModal.value = false
    await editProfileMutation.mutateAsync({ country: selectedCountry.value })
}

const onSelectCountry = () => {
    if (country.value !== user.value?.country) {
        selectedCountry.value = country.value ?? ''
        showModal.value = true
    }
}

const cancelChange = () => {
    country.value = user.value?.country ?? ''
    selectedCountry.value = ''
    showModal.value = false
}
</script>

<style scoped>
select.custom-select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
}
</style>
