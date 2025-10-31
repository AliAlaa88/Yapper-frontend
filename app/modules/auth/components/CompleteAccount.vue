<template>
    <ProfilePicture
        v-if="showProfilePicture"
        @next="onProfilePictureNext"
        @skip="onProfilePictureSkip"
        @close="onClose"
    />
    <Username
        v-if="showUsername"
        @next="onUsernameNext"
        @skip="onUsernameSkip"
        @back="onUsernameBack"
        @close="onClose"
        :Recommendations="props.Recommendations"
    />
    <Language
        v-if="showLanguage"
        @next="onLanguageNext"
        @skip="onLanguageSkip"
        @back="onLanguageBack"
        @close="onClose"
    />
    <Interests
        v-if="showInterests"
        @finish="onInterestsFinish"
        @skip="onInterestsSkip"
        @back="onInterestsBack"
        @close="onClose"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue'
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

const profileData = ref({
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
    (e: 'finish', data: typeof profileData.value): void
}>()

// Profile Picture handlers
const onProfilePictureNext = (imageUrl: string) => {
    profileData.value.profilePicture = imageUrl
    showProfilePicture.value = false
    showUsername.value = true
}

const onProfilePictureSkip = () => {
    profileData.value.profilePicture = null
    showProfilePicture.value = false
    showUsername.value = true
}

// Username handlers
const onUsernameNext = (username: string) => {
    profileData.value.username = username
    showUsername.value = false
    showLanguage.value = true
}

const onUsernameSkip = () => {
    profileData.value.username = null
    showUsername.value = false
    showLanguage.value = true
}

const onUsernameBack = () => {
    showUsername.value = false
    showProfilePicture.value = true
}

// Language handlers
const onLanguageNext = (language: string) => {
    profileData.value.language = language
    showLanguage.value = false
    showInterests.value = true
}

const onLanguageSkip = () => {
    profileData.value.language = null
    showLanguage.value = false
    showInterests.value = true
}

const onLanguageBack = () => {
    showLanguage.value = false
    showUsername.value = true
}

// Interests handlers
const onInterestsFinish = (interests: string[]) => {
    profileData.value.interests = interests
    emit('finish', profileData.value)
    router.push('/')
}

const onInterestsSkip = () => {
    profileData.value.interests = []
    emit('finish', profileData.value)
}

const onInterestsBack = () => {
    showInterests.value = false
    showLanguage.value = true
}

const onClose = () => {
    router.push('/')
}
</script>
