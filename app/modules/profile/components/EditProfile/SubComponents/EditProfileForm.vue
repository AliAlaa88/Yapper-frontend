<template>
    <div class="px-4 pt-6 pb-4 space-y-6">
        <div class="relative">
            <label
                for="edit-profile-name-input"
                class="absolute left-3 top-2 text-muted text-[13px] pointer-events-none"
            >
                {{ $t('profile.name') }}
            </label>
            <input
                id="edit-profile-name-input"
                :value="modelValue.name"
                type="text"
                :placeholder="$t('profile.editProfileModal.namePlaceholder')"
                class="w-full bg-transparent border border-primary rounded-md px-3 pt-6 pb-2 text-primary text-[17px] outline-none focus:border-blue-500 transition-colors duration-200"
                maxlength="50"
                @input="updateField('name', ($event.target as HTMLInputElement).value)"
            />
            <span class="absolute right-3 top-2 text-muted text-[13px]">
                {{ modelValue.name.length }}/50
            </span>
        </div>

        <!-- Bio Field -->
        <div class="relative">
            <label
                for="edit-profile-bio-input"
                class="absolute left-3 top-2 text-muted text-[13px] pointer-events-none"
            >
                {{ $t('profile.bio') }}
            </label>
            <textarea
                id="edit-profile-bio-input"
                :value="modelValue.bio"
                rows="3"
                :placeholder="$t('profile.editProfileModal.bioPlaceholder')"
                class="w-full bg-transparent border border-primary rounded-md px-3 pt-6 pb-2 text-primary text-[17px] outline-none focus:border-blue-500 transition-colors duration-200 resize-none"
                maxlength="160"
                @input="updateField('bio', ($event.target as HTMLTextAreaElement).value)"
            />
            <span class="absolute right-3 top-2 text-muted text-[13px]">
                {{ modelValue.bio.length }}/160
            </span>
        </div>

        <!-- Location Field -->
        <div class="relative">
            <label
                for="edit-profile-location-input"
                class="absolute left-3 top-2 text-muted text-[13px] pointer-events-none"
            >
                {{ $t('profile.location') }}
            </label>
            <input
                id="edit-profile-location-input"
                :value="modelValue.country"
                type="text"
                :placeholder="$t('profile.editProfileModal.locationPlaceholder')"
                class="w-full bg-transparent border border-primary rounded-md px-3 pt-6 pb-2 text-primary text-[17px] outline-none focus:border-blue-500 transition-colors duration-200"
                maxlength="30"
                @input="updateField('country', ($event.target as HTMLInputElement).value)"
            />
            <span class="absolute right-3 top-2 text-muted text-[13px]">
                {{ modelValue.country.length }}/30
            </span>
        </div>

        <!-- Birth Date Field -->
        <div class="relative">
            <label
                for="edit-profile-birthdate-input"
                class="absolute left-3 top-2 text-muted text-[13px] pointer-events-none"
            >
                {{ $t('profile.birthDate') }}
            </label>
            <input
                id="edit-profile-birthdate-input"
                :value="modelValue.created_at"
                type="date"
                class="w-full bg-transparent border border-primary rounded-md px-3 pt-6 pb-2 text-primary text-[17px] outline-none focus:border-blue-500 transition-colors duration-200 [&::-webkit-calendar-picker-indicator]:invert"
                @input="updateField('created_at', ($event.target as HTMLInputElement).value)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
interface FormData {
    name: string
    bio: string
    country: string
    created_at: string
}

const props = defineProps<{
    modelValue: FormData
}>()

const emit = defineEmits<{
    'update:modelValue': [value: FormData]
}>()

const updateField = (field: keyof FormData, value: string) => {
    emit('update:modelValue', {
        ...props.modelValue,
        [field]: value,
    })
}
</script>
