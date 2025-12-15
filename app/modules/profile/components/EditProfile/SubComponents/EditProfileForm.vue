<template>
    <div class="px-4 pt-6 pb-4 space-y-6">
        <div class="relative">
            <input
                id="edit-profile-name-input"
                :value="modelValue.name"
                type="text"
                :placeholder="$t('profile.editProfileModal.namePlaceholder')"
                class="peer w-full bg-transparent border border-primary rounded-md px-3 pt-6 pb-2 text-primary text-[17px] outline-none focus:border-2 focus:border-accent transition-colors duration-200"
                style="unicode-bidi: plaintext"
                maxlength="50"
                @input="updateField('name', ($event.target as HTMLInputElement).value)"
            >
            <label
                for="edit-profile-name-input"
                class="absolute start-3 top-2 text-muted text-[13px] pointer-events-none peer-focus:text-accent"
            >
                {{ $t('profile.name') }}
            </label>
            <span class="absolute end-3 top-2 text-muted text-[13px] peer-focus:text-accent">
                {{ formatNumber(modelValue.name.length) }}/{{ formatNumber(50) }}
            </span>
        </div>

        <div class="relative">
            <textarea
                id="edit-profile-bio-input"
                :value="modelValue.bio"
                rows="3"
                :placeholder="$t('profile.editProfileModal.bioPlaceholder')"
                class="peer w-full bg-transparent border border-primary rounded-md px-3 pt-6 pb-2 text-primary text-[17px] outline-none focus:border-2 focus:border-accent transition-colors duration-200 resize-none"
                style="unicode-bidi: plaintext"
                maxlength="160"
                @input="updateField('bio', ($event.target as HTMLTextAreaElement).value)"
            />
            <label
                for="edit-profile-bio-input"
                class="absolute start-3 top-2 text-muted text-[13px] pointer-events-none peer-focus:text-accent"
            >
                {{ $t('profile.bio') }}
            </label>
            <span class="absolute end-3 top-2 text-muted text-[13px] peer-focus:text-accent">
                {{ formatNumber(modelValue.bio.length) }}/{{ formatNumber(160) }}
            </span>
        </div>

        <div class="relative">
            <input
                id="edit-profile-location-input"
                :value="modelValue.country"
                type="text"
                :placeholder="$t('profile.editProfileModal.locationPlaceholder')"
                class="peer w-full bg-transparent border border-primary rounded-md px-3 pt-6 pb-2 text-primary text-[17px] outline-none focus:border-2 focus:border-accent transition-colors duration-200"
                style="unicode-bidi: plaintext"
                maxlength="30"
                @input="updateField('country', ($event.target as HTMLInputElement).value)"
            >
            <label
                for="edit-profile-location-input"
                class="absolute start-3 top-2 text-muted text-[13px] pointer-events-none peer-focus:text-accent"
            >
                {{ $t('profile.location') }}
            </label>
            <span class="absolute end-3 top-2 text-muted text-[13px] peer-focus:text-accent">
                {{ formatNumber(modelValue.country.length) }}/{{ formatNumber(30) }}
            </span>
        </div>

        <div>
            <label class="block text-muted text-[13px] mb-2">
                {{ $t('profile.birthDate') }}
            </label>
            <div class="flex gap-3">
                <div class="flex-1 relative">
                    <select
                        id="edit-profile-month-input"
                        v-model="selectedMonth"
                        class="w-full bg-primary text-primary cursor-pointer border-2 border-primary rounded-md px-4 py-3 focus:outline-none focus:border-accent appearance-none shadow-sm transition-colors"
                    >
                        <option value="" disabled>
                            {{ $t('profile.editProfileModal.month') }}
                        </option>
                        <option v-for="m in months" :key="m.value" :value="m.value">
                            {{ m.label }}
                        </option>
                    </select>
                    <span
                        class="absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary"
                    >▼</span
                    >
                </div>

                <div class="flex-1 relative">
                    <select
                        id="edit-profile-day-input"
                        v-model="selectedDay"
                        class="w-full bg-primary text-primary cursor-pointer border-2 border-primary rounded-md px-4 py-3 focus:outline-none focus:border-accent appearance-none shadow-sm transition-colors"
                    >
                        <option value="" disabled>{{ $t('profile.editProfileModal.day') }}</option>
                        <option v-for="d in days" :key="d" :value="d">{{ formatNumber(d) }}</option>
                    </select>
                    <span
                        class="absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary"
                    >▼</span
                    >
                </div>

                <div class="flex-1 relative">
                    <select
                        id="edit-profile-year-input"
                        v-model="selectedYear"
                        class="w-full bg-primary text-primary cursor-pointer border-2 border-primary rounded-md px-4 py-3 focus:outline-none focus:border-accent appearance-none shadow-sm transition-colors"
                    >
                        <option value="" disabled>{{ $t('profile.editProfileModal.year') }}</option>
                        <option v-for="y in years" :key="y" :value="y">
                            {{ formatNumber(y) }}
                        </option>
                    </select>
                    <span
                        class="absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary"
                    >▼</span
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface FormData {
    name: string
    bio: string
    country: string
    birth_date: string
}

const props = defineProps<{
    modelValue: FormData
}>()

const emit = defineEmits<{
    'update:modelValue': [value: FormData]
    'update:isBirthDateValid': [value: boolean]
}>()

const { t, locale } = useI18n()

const formatNumber = (num: number) => {
    return num.toLocaleString(locale.value === 'ar' ? 'ar-EG' : 'en-US', { useGrouping: false })
}

const months = computed(() => [
    { value: '1', label: t('months.january') },
    { value: '2', label: t('months.february') },
    { value: '3', label: t('months.march') },
    { value: '4', label: t('months.april') },
    { value: '5', label: t('months.may') },
    { value: '6', label: t('months.june') },
    { value: '7', label: t('months.july') },
    { value: '8', label: t('months.august') },
    { value: '9', label: t('months.september') },
    { value: '10', label: t('months.october') },
    { value: '11', label: t('months.november') },
    { value: '12', label: t('months.december') },
])

const days = Array.from({ length: 31 }, (_, i) => i + 1)

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 120 }, (_, i) => currentYear - i)

const birthMonth = computed(() => {
    if (!props.modelValue.birth_date) return ''
    const date = new Date(props.modelValue.birth_date)
    return (date.getMonth() + 1).toString()
})

const birthDay = computed(() => {
    if (!props.modelValue.birth_date) return ''
    const date = new Date(props.modelValue.birth_date)
    return date.getDate().toString()
})

const birthYear = computed(() => {
    if (!props.modelValue.birth_date) return ''
    const date = new Date(props.modelValue.birth_date)
    return date.getFullYear().toString()
})

const updateField = (field: keyof FormData, value: string) => {
    emit('update:modelValue', {
        ...props.modelValue,
        [field]: value,
    })
}

const selectedMonth = computed({
    get: () => birthMonth.value,
    set: (value: string) => updateBirthDate('month', value),
})

const selectedDay = computed({
    get: () => birthDay.value,
    set: (value: string) => updateBirthDate('day', value),
})

const selectedYear = computed({
    get: () => birthYear.value,
    set: (value: string) => updateBirthDate('year', value),
})

const updateBirthDate = (part: 'month' | 'day' | 'year', value: string) => {
    const currentMonth = birthMonth.value || '1'
    const currentDay = birthDay.value || '1'
    const currentYear = birthYear.value || new Date().getFullYear().toString()

    const month = part === 'month' ? value : currentMonth
    const day = part === 'day' ? value : currentDay
    const year = part === 'year' ? value : currentYear

    if (month && day && year) {
        const birthDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
        updateField('birth_date', birthDate)
    }
}

const MIN_AGE_YEARS = 6

const isBirthDateValid = computed(() => {
    if (!props.modelValue.birth_date) return true // Allow empty birth date

    const birthDate = new Date(props.modelValue.birth_date)
    const today = new Date()

    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }

    return age >= MIN_AGE_YEARS
})

watch(
    isBirthDateValid,
    (isValid) => {
        emit('update:isBirthDateValid', isValid)
    },
    { immediate: true },
)
</script>
