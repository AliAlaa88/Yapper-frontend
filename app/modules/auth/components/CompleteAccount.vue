<template>
    <ProfilePicture
        v-if="showProfilePicture"
        v-model:profilePicture="profileData.profilePicture"
        @next="onProfilePictureNext"
        @skip="onProfilePictureSkip"
        @close="onClose"
    />
    <Username
        v-if="showUsername"
        v-model:username="profileData.username"
        @next="onUsernameNext"
        @skip="onUsernameSkip"
        @back="onUsernameBack"
        @close="onClose"
        :Recommendations="props.Recommendations"
    />
    <Language
        v-if="showLanguage"
        v-model:selectedLanguage="profileData.language"
        @next="onLanguageNext"
        @skip="onLanguageSkip"
        @back="onLanguageBack"
        @close="onClose"
    />
    <Interests
        v-if="showInterests"
        v-model:selectedInterests="profileData.interests"
        @finish="onInterestsFinish"
        @skip="onInterestsSkip"
        @back="onInterestsBack"
        @close="onClose"
    />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import ProfilePicture from './subComponents/CompleteAccountComponents/ProfilePicture.vue'
import Username from './subComponents/CompleteAccountComponents/Username.vue'
import Language from './subComponents/CompleteAccountComponents/Language.vue'
import Interests from './subComponents/CompleteAccountComponents/Interests.vue'
import { useRouter } from 'vue-router'
import { useGetUserQuery } from '../queries/useGetuserQuery'
import { useUserStore } from '~/modules/auth/stores/userStore';
import { language } from 'happy-dom/lib/PropertySymbol.js'
const userStore = useUserStore()
const router = useRouter()
const showProfilePicture = ref(false)
const showUsername = ref(false)
const showLanguage = ref(false)
const showInterests = ref(false)
const enableUserQuery = ref(false)
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
// Centralized profile completion state
const profileData = reactive({
    profilePicture: null as string | null,
    username: null as string | null,
    language: null as string | null,
    interests: [] as string[],
})

const props = defineProps<{
    Recommendations: string[]
    skipImg?: boolean
}>()

if (props.skipImg) {
    showUsername.value = true
} else {
    showProfilePicture.value = true
}

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'finish', data: typeof profileData): void
}>()

// Profile Picture handlers
const onProfilePictureNext = (imageUrl: string) => {
    profileData.profilePicture = imageUrl
    showProfilePicture.value = false
    showUsername.value = true
}

const onProfilePictureSkip = () => {
    profileData.profilePicture = null
    showProfilePicture.value = false
    showUsername.value = true
}

// Username handlers
const onUsernameNext = (username: string) => {
    profileData.username = username
    showUsername.value = false
    showLanguage.value = true
}

const onUsernameSkip = () => {
    profileData.username = null
    showUsername.value = false
    showLanguage.value = true
}

const onUsernameBack = () => {
    showUsername.value = false
    if (props.skipImg) {
        onClose()
    } else {
        showProfilePicture.value = true
    }
}

// Language handlers
const onLanguageNext = (language: string) => {
    profileData.language = language
    locale.value = language as 'en' | 'ar'
    showLanguage.value = false
    showInterests.value = true
}

const onLanguageSkip = () => {
    profileData.language = null
    showLanguage.value = false
    showInterests.value = true
}

const onLanguageBack = () => {
    showLanguage.value = false
    showUsername.value = true
}

const getUserQuery = useGetUserQuery(
    enableUserQuery,
    (data) => {
        userStore.setAuth({
            access_token: useCookie('access_token').value || '',
            user: data.data
        });
        emit('finish', profileData);
        router.push('/');
    },
    (error) => {
        console.error("Failed to fetch user data after complete account:", error);
        // Still navigate even if fetch fails, user data might already be in store
        emit('finish', profileData);
        router.push('/');
    }
)

// Interests handlers
const onInterestsFinish = (interests: string[]) => {
    profileData.interests = interests
    enableUserQuery.value = true
}

const onInterestsSkip = () => {
    profileData.interests = []
    enableUserQuery.value = true
}

const onInterestsBack = () => {
    showInterests.value = false
    showLanguage.value = true
}

const onClose = () => {
    if(profileData.language) {
        locale.value = profileData.language as 'en' | 'ar'
    }
    router
}
</script>
