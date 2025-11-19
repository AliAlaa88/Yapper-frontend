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

const router = useRouter()
const showProfilePicture = ref(false)
const showUsername = ref(false)
const showLanguage = ref(false)
const showInterests = ref(false)

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

// Interests handlers
const onInterestsFinish = (interests: string[]) => {
    profileData.interests = interests
    emit('finish', profileData)
    router.push('/')
}

const onInterestsSkip = () => {
    profileData.interests = []
    emit('finish', profileData)
}

const onInterestsBack = () => {
    showInterests.value = false
    showLanguage.value = true
}

const onClose = () => {
    router.push('/')
}
</script>
